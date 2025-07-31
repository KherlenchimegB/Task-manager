// backend/src/services/emailService.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendTaskReminder = async (userEmail, taskTitle, dueDate) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Task Reminder',
    html: `
      <h2>Task Reminder</h2>
      <p>Your task "${taskTitle}" is due on ${dueDate}</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};