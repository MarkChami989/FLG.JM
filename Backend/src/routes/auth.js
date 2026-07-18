const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { sendVerificationEmail } = require('../mailer');

const router = express.Router();
const OTP_TTL_MS = 10 * 60 * 1000;

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function publicClient(c) {
  const { passwordHash, otpCode, otpExpiresAt, ...pub } = c;
  return pub;
}

router.post('/register', async (req, res) => {
  const { username, email, password, phone, dob } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email, password are required' });
  }
  const emailLower = email.toLowerCase();
  const exists = db.data.clients.find((c) => c.email.toLowerCase() === emailLower || c.username === username);
  if (exists) return res.status(409).json({ error: 'Username or email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const otpCode = genOtp();
  const client = {
    id: db.nextClientId(),
    username,
    email,
    passwordHash,
    phone: phone || '',
    dob: dob || '',
    verified: false,
    otpCode,
    otpExpiresAt: Date.now() + OTP_TTL_MS,
  };
  db.data.clients.push(client);
  db.save();

  try {
    await sendVerificationEmail(email, otpCode);
  } catch (e) {
    return res.status(502).json({ error: 'Account created but failed to send verification email', detail: e.message });
  }

  res.status(201).json(publicClient(client));
});

router.post('/resend', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email is required' });
  const client = db.data.clients.find((c) => c.email.toLowerCase() === email.toLowerCase());
  if (!client) return res.status(404).json({ error: 'Account not found' });
  if (client.verified) return res.status(400).json({ error: 'Account already verified' });

  client.otpCode = genOtp();
  client.otpExpiresAt = Date.now() + OTP_TTL_MS;
  db.save();

  try {
    await sendVerificationEmail(client.email, client.otpCode);
  } catch (e) {
    return res.status(502).json({ error: 'Failed to send verification email', detail: e.message });
  }

  res.json({ ok: true });
});

router.post('/verify', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'email and code are required' });
  const client = db.data.clients.find((c) => c.email.toLowerCase() === email.toLowerCase());
  if (!client) return res.status(404).json({ error: 'Account not found' });
  if (client.verified) return res.status(400).json({ error: 'Account already verified' });
  if (!client.otpCode || Date.now() > client.otpExpiresAt) {
    return res.status(400).json({ error: 'Code expired, please request a new one' });
  }
  if (client.otpCode !== String(code)) {
    return res.status(400).json({ error: 'Invalid code' });
  }

  client.verified = true;
  client.otpCode = null;
  client.otpExpiresAt = null;
  db.save();

  res.json(publicClient(client));
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });
  const client = db.data.clients.find((c) => c.username === username);
  if (!client) return res.status(401).json({ error: 'Invalid username or password' });
  const ok = await bcrypt.compare(password, client.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid username or password' });
  if (!client.verified) return res.status(403).json({ error: 'Account not verified' });
  res.json(publicClient(client));
});

module.exports = router;
