import Issue from '../models/Issue.js';
import User from '../models/User.js';
import { sendEmail, getIssueStatusTemplate } from '../utils/emailService.js';

export const getAdminIssues = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      category,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      priority
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = { isActive: true };
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { issueId: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort = { [sortBy]: sortOrder };

    const [issues, total] = await Promise.all([
      Issue.find(filter)
        .populate('reportedBy', 'name email phone')
        .populate('assignedTo', 'name email phone')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Issue.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: {
        issues,
        pagination: {
          current: pageNum,
          total: Math.ceil(total / limitNum),
          count: issues.length,
          totalItems: total
        }
      }
    });
  } catch (error) {
    console.error('Get admin issues error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issues'
    });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message, priority } = req.body;

    const validStatuses = ['pending', 'approved', 'declined', 'in-progress', 'assigned', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const issue = await Issue.findById(id)
      .populate('reportedBy', 'name email');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Update issue
    const oldStatus = issue.status;
    issue.status = status;
    if (priority) issue.priority = priority;

    // Add to history
    issue.history.push({
      action: status,
      message: message || `Status changed from ${oldStatus} to ${status}`,
      actionBy: req.user._id
    });

    await issue.save();

    // Send email notification
    try {
      if (issue.reportedBy?.email && status !== oldStatus) {
        const emailTemplate = getIssueStatusTemplate(issue, issue.reportedBy);
        await sendEmail({
          email: issue.reportedBy.email,
          subject: `Issue Status Updated - ${issue.issueId}`,
          message: emailTemplate
        });
      }
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
    }

    await issue.populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      message: 'Issue status updated successfully',
      data: { issue }
    });
  } catch (error) {
    console.error('Update issue status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating issue status'
    });
  }
};

export const assignIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo, estimatedCost } = req.body;

    // Validate assignee exists and has authority role
    if (assignedTo) {
      const assignee = await User.findById(assignedTo);
      if (!assignee || !['authority', 'admin'].includes(assignee.role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid assignee'
        });
      }
    }

    const issue = await Issue.findById(id)
      .populate('reportedBy', 'name email');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Update assignment
    const oldAssignee = issue.assignedTo;
    issue.assignedTo = assignedTo || null;
    if (estimatedCost !== undefined) issue.estimatedCost = estimatedCost;

    // Add to history
    if (assignedTo && assignedTo !== oldAssignee?.toString()) {
      issue.status = 'assigned';
      issue.history.push({
        action: 'assigned',
        message: 'Issue assigned to maintenance team',
        actionBy: req.user._id
      });
    } else if (!assignedTo && oldAssignee) {
      issue.status = 'approved';
      issue.history.push({
        action: 'unassigned',
        message: 'Issue unassigned from maintenance team',
        actionBy: req.user._id
      });
    }

    await issue.save();

    // Send email notification
    try {
      if (issue.reportedBy?.email && assignedTo && assignedTo !== oldAssignee?.toString()) {
        const emailTemplate = getIssueStatusTemplate(issue, issue.reportedBy);
        await sendEmail({
          email: issue.reportedBy.email,
          subject: `Issue Assigned - ${issue.issueId}`,
          message: emailTemplate
        });
      }
    } catch (emailError) {
      console.error('Failed to send assignment email:', emailError);
    }

    await issue.populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      message: 'Issue assignment updated successfully',
      data: { issue }
    });
  } catch (error) {
    console.error('Assign issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning issue'
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalIssues,
      statusStats,
      priorityStats,
      categoryStats,
      recentIssues,
      monthlyTrends
    ] = await Promise.all([
      Issue.countDocuments({ isActive: true }),
      Issue.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Issue.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Issue.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Issue.find({ isActive: true })
        .populate('reportedBy', 'name')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Issue.aggregate([
        {
          $match: {
            isActive: true,
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          total: totalIssues
        },
        statusStats,
        priorityStats,
        categoryStats,
        recentIssues,
        monthlyTrends
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin statistics'
    });
  }
};