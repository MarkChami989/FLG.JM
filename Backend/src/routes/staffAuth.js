const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { sendVerificationEmail } = require('../mailer');

const router = express.Router();
const OTP_TTL_MS = 10 * 60 * 1000;

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function publicStaff(s) {
  const { passwordHash, otpCode, otpExpiresAt, _id, ...pub } = s;
  return pub;
}

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });
  const staff = await db.staff().findOne({ username });
  if (!staff) return res.status(401).json({ error: 'Invalid username or password' });
  const ok = await bcrypt.compare(password, staff.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid username or password' });
  if (staff.status !== 'active') return res.status(403).json({ error: 'Account suspended, contact admin' });

  const otpCode = genOtp();
  const otpExpiresAt = Date.now() + OTP_TTL_MS;
  await db.staff().updateOne({ id: staff.id }, { $set: { otpCode, otpExpiresAt } });

  try {
    await sendVerificationEmail(staff.email, otpCode);
  } catch (e) {
    return res.status(502).json({ error: 'Failed to send verification email', detail: e.message });
  }

  res.json({ ok: true, email: staff.email });
});

router.post('/resend', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username is required' });
  const staff = await db.staff().findOne({ username });
  if (!staff) return res.status(404).json({ error: 'Account not found' });
  if (staff.status !== 'active') return res.status(403).json({ error: 'Account suspended, contact admin' });

  const otpCode = genOtp();
  const otpExpiresAt = Date.now() + OTP_TTL_MS;
  await db.staff().updateOne({ id: staff.id }, { $set: { otpCode, otpExpiresAt } });

  try {
    await sendVerificationEmail(staff.email, otpCode);
  } catch (e) {
    return res.status(502).json({ error: 'Failed to send verification email', detail: e.message });
  }

  res.json({ ok: true, email: staff.email });
});

router.post('/verify', async (req, res) => {
  const { username, code } = req.body;
  if (!username || !code) return res.status(400).json({ error: 'username and code are required' });
  const staff = await db.staff().findOne({ username });
  if (!staff) return res.status(404).json({ error: 'Account not found' });
  if (!staff.otpCode || Date.now() > staff.otpExpiresAt) {
    return res.status(400).json({ error: 'Code expired, please request a new one' });
  }
  if (staff.otpCode !== String(code)) {
    return res.status(400).json({ error: 'Invalid code' });
  }

  const update = { otpCode: null, otpExpiresAt: null };
  await db.staff().updateOne({ id: staff.id }, { $set: update });

  res.json({ ...publicStaff({ ...staff, ...update }), role: 'staff' });
});

module.exports = router;
