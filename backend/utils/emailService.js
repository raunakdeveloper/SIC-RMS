import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (options) => {
  try {
    const message = {
      from: `RMS System <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: options.message
    };

    await transporter.sendMail(message);
    // console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const getIssueStatusTemplate = (issue, user) => {
  const statusMessages = {
    approved: 'Your reported issue has been approved and will be addressed soon.',
    declined: 'Your reported issue has been declined. Please contact support if you have questions.',
    'in-progress': 'Work has started on your reported issue.',
    assigned: 'Your issue has been assigned to a maintenance team.',
    resolved: 'Your reported issue has been resolved. Thank you for your report.'
  };

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563EB; color: white; padding: 20px; text-align: center;">
        <h1>RMS - Road Management System</h1>
      </div>
      
      <div style="padding: 20px; background: #f9fafb;">
        <h2>Issue Status Update</h2>
        <p>Dear ${user.name},</p>
        
        <p>${statusMessages[issue.status]}</p>
        
        <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3>Issue Details:</h3>
          <p><strong>Issue ID:</strong> ${issue.issueId}</p>
          <p><strong>Title:</strong> ${issue.title}</p>
          <p><strong>Status:</strong> ${issue.status.toUpperCase()}</p>
          <p><strong>Location:</strong> ${issue.location.address}</p>
        </div>
        
        <p>You can track your issue status by visiting our website.</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.CLIENT_URL}/issue/${issue._id}" 
             style="background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Issue Details
          </a>
        </div>
        
        <p>Thank you for helping us improve our roads!</p>
        
        <hr style="margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">
          This is an automated email from RMS. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;
};