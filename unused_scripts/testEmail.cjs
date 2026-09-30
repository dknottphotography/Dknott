require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log("Testing Nodemailer...");
  console.log("User:", process.env.SMTP_USER);
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "Test email from Node",
      text: "This is a test email.",
    });
    console.log("Success! Message ID:", info.messageId);
  } catch (err) {
    console.error("Failed to send:", err);
  }
}

testEmail();
