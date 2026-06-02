const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error(`Failed to send email to ${to}`, err);
  }
};

const sendLeadAssignedEmail = ({ agentEmail, agentName, leadName }) => {
  const subject = `New Lead Assigned: ${leadName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2 style="color: #2563eb;">New Lead Assigned to You</h2>
      <p>Hi <strong>${agentName}</strong>,</p>
      <p>A new lead has been assigned to you:</p>
      <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Lead Name:</strong> ${leadName}</p>
      </div>
      <p>Please review and follow up at your earliest convenience.</p>
      <p style="color: #64748b; font-size: 12px;">— Lead Management System</p>
    </div>
  `;
  return sendMail(agentEmail, subject, html);
};

const sendLeadWonEmail = ({ managerEmail, managerName, leadName }) => {
  const subject = `Lead Won: ${leadName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
      <h2 style="color: #16a34a;">Lead Won! 🎉</h2>
      <p>Hi <strong>${managerName}</strong>,</p>
      <p>Great news — a lead has been marked as <strong>Won</strong>:</p>
      <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Lead Name:</strong> ${leadName}</p>
      </div>
      <p>Congratulations!</p>
      <p style="color: #64748b; font-size: 12px;">— Lead Management System</p>
    </div>
  `;
  return sendMail(managerEmail, subject, html);
};

module.exports = { sendLeadAssignedEmail, sendLeadWonEmail };
