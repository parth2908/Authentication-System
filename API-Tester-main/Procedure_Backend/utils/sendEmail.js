const cron = require('node-cron');
const db = require('../config/db');

// utils/sendEmail.js

const nodemailer = require('nodemailer');

async function sendEmail(to, subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'makwanaparth018@gmail.com',
      pass: 'zhbg vsko cpym xpoa',
    },
  });

  await transporter.sendMail({
    from: 'makwanaparth018@gmail.com',
    to,
    subject,
    html: htmlContent,
  });
}

module.exports = sendEmail;
