const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { sendVerificationEmail } = require('../mailer');

const router = express.Router();
const OTP_TTL_MS = 10 * 60 * 1000;

const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mark.chamii444@gmail.com';

let otp = null; // login OTP
let settingsOtp = null; // OTP for password/profile changes from Settings

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function getAdmin() {
  let admin = await db.admin().findOne({ id: 'admin' });
  if (!admin) {
    admin = {
      id: 'admin',
      username: DEFAULT_ADMIN_USERNAME,
      email: DEFAULT_ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10),
    };
    await db.admin().insertOne(admin);
  }
  return admin;
}

function publicAdmin(a) {
  return { username: a.username, email: a.email, role: 'admin' };
}

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });
  const admin = await getAdmin();
  if (username !== admin.username) return res.status(401).json({ error: 'Invalid username or password' });
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid username or password' });

  const code = genOtp();
  otp = { code, expiresAt: Date.now() + OTP_TTL_MS };

  try {
    await sendVerificationEmail(admin.email, code);
  } catch (e) {
    return res.status(502).json({ error: 'Failed to send verification email', detail: e.message });
  }

  res.json({ ok: true });
});

router.post('/resend', async (req, res) => {
  if (!otp) return res.status(400).json({ error: 'No pending login' });
  const admin = await getAdmin();
  const code = genOtp();
  otp = { code, expiresAt: Date.now() + OTP_TTL_MS };

  try {
    await sendVerificationEmail(admin.email, code);
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
  const admin = await getAdmin();
  res.json(publicAdmin(admin));
});

// ---- Settings: change password ----
router.post('/settings/password/send-code', async (req, res) => {
  const admin = await getAdmin();
  const code = genOtp();
  settingsOtp = { code, expiresAt: Date.now() + OTP_TTL_MS };

  try {
    await sendVerificationEmail(admin.email, code);
  } catch (e) {
    return res.status(502).json({ error: 'Failed to send verification email', detail: e.message });
  }

  res.json({ ok: true, email: admin.email });
});

router.post('/settings/password/change', async (req, res) => {
  const { code, currentPassword, newPassword, confirmPassword } = req.body;
  if (!code || !currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'code, currentPassword, newPassword and confirmPassword are required' });
  }
  if (!settingsOtp || Date.now() > settingsOtp.expiresAt) {
    return res.status(400).json({ error: 'Code expired, please request a new one' });
  }
  if (settingsOtp.code !== String(code)) {
    return res.status(400).json({ error: 'Invalid code' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  const admin = await getAdmin();
  const ok = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Current password is incorrect' });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.admin().updateOne({ id: 'admin' }, { $set: { passwordHash } });
  settingsOtp = null;

  res.json({ ok: true });
});

// ---- Settings: change username / email ----
router.post('/settings/profile/send-code', async (req, res) => {
  const admin = await getAdmin();
  const code = genOtp();
  settingsOtp = { code, expiresAt: Date.now() + OTP_TTL_MS };

  try {
    await sendVerificationEmail(admin.email, code);
  } catch (e) {
    return res.status(502).json({ error: 'Failed to send verification email', detail: e.message });
  }

  res.json({ ok: true, email: admin.email });
});

router.post('/settings/profile/update', async (req, res) => {
  const { code, username, email } = req.body;
  if (!code || !username || !email) {
    return res.status(400).json({ error: 'code, username and email are required' });
  }
  if (!settingsOtp || Date.now() > settingsOtp.expiresAt) {
    return res.status(400).json({ error: 'Code expired, please request a new one' });
  }
  if (settingsOtp.code !== String(code)) {
    return res.status(400).json({ error: 'Invalid code' });
  }

  await db.admin().updateOne({ id: 'admin' }, { $set: { username, email } });
  settingsOtp = null;

  const admin = await getAdmin();
  res.json(publicAdmin(admin));
});

module.exports = router;
