import Issue from '../models/Issue.js';
import Vote from '../models/Vote.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { generateIssueId } from '../utils/generateIssueId.js';
import { sendEmail, getIssueStatusTemplate } from '../utils/emailService.js';

export const createIssue = async (req, res) => {
  try {
    const { title, description, category, location, imageUrl } = req.body;
    const reportedBy = req.user._id;

    const issueId = await generateIssueId();

    const issue = await Issue.create({
      issueId,
      title,
      description,
      category,
      location,
      imageUrl,
      reportedBy,
      history: [{
        action: 'created',
        message: 'Issue reported',
        actionBy: reportedBy
      }]
    });

    // Populate reporter info
    await issue.populate('reportedBy', 'name email');

    // Send email confirmation
    try {
      const emailTemplate = getIssueStatusTemplate(issue, req.user);
      await sendEmail({
        email: req.user.email,
        subject: `Issue Reported - ${issue.issueId}`,
        message: emailTemplate
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      data: { issue }
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating issue'
    });
  }
};

export const getIssues = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = { isActive: true };
    
    if (status) filter.status = status;
    if (category) filter.category = category;
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
        .populate('reportedBy', 'name')
        .populate('assignedTo', 'name')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Issue.countDocuments(filter)
    ]);

    // Add user vote info if authenticated
    if (req.user) {
      const issueIds = issues.map(issue => issue._id);
      const userVotes = await Vote.find({
        userId: req.user._id,
        issueId: { $in: issueIds }
      }).lean();

      const voteMap = userVotes.reduce((acc, vote) => {
        acc[vote.issueId.toString()] = vote.vote;
        return acc;
      }, {});

      issues.forEach(issue => {
        issue.userVote = voteMap[issue._id.toString()] || null;
      });
    }

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
    console.error('Get issues error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issues'
    });
  }
};

export const getIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findById(id)
      .populate('reportedBy', 'name email phone profile')
      .populate('assignedTo', 'name email profile')
      .populate({
        path: 'history.actionBy',
        select: 'name'
      });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Get comments
    const comments = await Comment.find({ 
      issueId: id, 
      isActive: true 
    })
    .populate('userId', 'name profile')
    .sort({ createdAt: -1 });

    // Get user vote if authenticated
    let userVote = null;
    if (req.user) {
      const vote = await Vote.findOne({
        userId: req.user._id,
        issueId: id
      });
      userVote = vote ? vote.vote : null;
    }

    res.status(200).json({
      success: true,
      data: {
        issue,
        comments,
        userVote
      }
    });
  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issue'
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const [
      totalIssues,
      pendingIssues,
      resolvedIssues,
      inProgressIssues,
      categoryStats
    ] = await Promise.all([
      Issue.countDocuments({ isActive: true }),
      Issue.countDocuments({ status: 'pending', isActive: true }),
      Issue.countDocuments({ status: 'resolved', isActive: true }),
      Issue.countDocuments({ 
        status: { $in: ['in-progress', 'assigned'] },
        isActive: true 
      }),
      Issue.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          total: totalIssues,
          pending: pendingIssues,
          resolved: resolvedIssues,
          inProgress: inProgressIssues
        },
        categoryStats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};

export const voteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body; // 'upvote' or 'downvote'
    const userId = req.user._id;

    if (!['upvote', 'downvote'].includes(vote)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vote type'
      });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({ userId, issueId: id });

    if (existingVote) {
      if (existingVote.vote === vote) {
        // Remove vote (toggle off)
        await Vote.findByIdAndDelete(existingVote._id);
        
        // Update issue count
        if (vote === 'upvote') {
          issue.upvotesCount = Math.max(0, issue.upvotesCount - 1);
        }
        await issue.save();

        return res.status(200).json({
          success: true,
          message: 'Vote removed',
          data: { action: 'removed', issue }
        });
      } else {
        // Change vote
        existingVote.vote = vote;
        await existingVote.save();

        // Update issue count
        if (vote === 'upvote') {
          issue.upvotesCount += 1;
        } else {
          issue.upvotesCount = Math.max(0, issue.upvotesCount - 1);
        }
        await issue.save();

        return res.status(200).json({
          success: true,
          message: 'Vote updated',
          data: { action: 'updated', issue }
        });
      }
    } else {
      // New vote
      await Vote.create({ userId, issueId: id, vote });

      // Update issue count
      if (vote === 'upvote') {
        issue.upvotesCount += 1;
      }
      await issue.save();

      return res.status(200).json({
        success: true,
        message: 'Vote added',
        data: { action: 'added', issue }
      });
    }
  } catch (error) {
    console.error('Vote issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error voting on issue'
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const comment = await Comment.create({
      issueId: id,
      userId,
      text: text.trim()
    });

    await comment.populate('userId', 'name profile');

    // Update comments count
    issue.commentsCount += 1;
    await issue.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment'
    });
  }
};