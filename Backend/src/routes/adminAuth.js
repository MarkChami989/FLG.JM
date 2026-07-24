const express = require('express');
const { sendVerificationEmail } = require('../mailer');

const router = express.Router();
const OTP_TTL_MS = 10 * 60 * 1000;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mark.chamii444@gmail.com';

let otp = null;

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const code = genOtp();
  otp = { code, expiresAt: Date.now() + OTP_TTL_MS };

  try {
    await sendVerificationEmail(ADMIN_EMAIL, code);
  } catch (e) {
    return res.status(502).json({ error: 'Failed to send verification email', detail: e.message });
  }

  res.json({ ok: true });
});

router.post('/resend', async (req, res) => {
  if (!otp) return res.status(400).json({ error: 'No pending login' });
  const code = genOtp();
  otp = { code, expiresAt: Date.now() + OTP_TTL_MS };

  try {
    await sendVerificationEmail(ADMIN_EMAIL, code);
  } catch (e) {
    return res.status(502).json({ error: 'Failed to send verification email', detail: e.message });
  }

  res.json({ ok: true });
});

router.post('/verify', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'code is required' });
  if (!otp || Date.now() > otp.expiresAt) {
    return res.status(400).json({ error: 'Code expired, please request a new one' });
  }
  if (otp.code !== String(code)) {
    return res.status(400).json({ error: 'Invalid code' });
  }

  otp = null;
  res.json({ username: ADMIN_USERNAME, email: ADMIN_EMAIL, role: 'admin' });
});

module.exports = router;
