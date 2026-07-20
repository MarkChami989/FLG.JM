const nodemailer = require('nodemailer');

const SENDER_EMAIL = 'flg.administration@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER_EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendVerificationEmail(to, code) {
  if (!process.env.EMAIL_APP_PASSWORD) {
    console.log(`[verification code] ${to} -> ${code}`);
    return { skipped: true };
  }

  return transporter.sendMail({
    from: `"Fusion Luxury Game" <${SENDER_EMAIL}>`,
    to,
    subject: 'Your verification code',
    text: `Your Fusion Luxury Game verification code is: ${code}\n\nThis code expires in 10 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px;background:#0f0a1a;color:#f4f0ff;border-radius:12px;">
        <h2 style="margin:0 0 12px;color:#f0abfc;">Fusion Luxury Game</h2>
        <p>Your verification code is:</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#c084fc;margin:16px 0;">${code}</div>
        <p style="color:#a3a3a3;font-size:13px;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { sendVerificationEmail };
