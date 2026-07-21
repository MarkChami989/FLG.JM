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
  const { passwordHash, otpCode, otpExpiresAt, _id, ...pub } = c;
  return pub;
}

function byEmailCaseInsensitive(email) {
  return { $expr: { $eq: [{ $toLower: '$email' }, email.toLowerCase()] } };
}

router.post('/register', async (req, res) => {
  const { username, email, password, phone, dob } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email, password are required' });
  }
  const exists = await db.clients().findOne({ $or: [byEmailCaseInsensitive(email), { username }] });
  if (exists) return res.status(409).json({ error: 'Username or email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const otpCode = genOtp();
  const client = {
    id: await db.nextClientId(),
    username,
    email,
    passwordHash,
    phone: phone || '',
    dob: dob || '',
    verified: false,
    otpCode,
    otpExpiresAt: Date.now() + OTP_TTL_MS,
  };
  await db.clients().insertOne(client);

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
  const client = await db.clients().findOne(byEmailCaseInsensitive(email));
  if (!client) return res.status(404).json({ error: 'Account not found' });
  if (client.verified) return res.status(400).json({ error: 'Account already verified' });

  const otpCode = genOtp();
  const otpExpiresAt = Date.now() + OTP_TTL_MS;
  await db.clients().updateOne({ id: client.id }, { $set: { otpCode, otpExpiresAt } });

  try {
    await sendVerificationEmail(client.email, otpCode);
  } catch (e) {
    return res.status(502).json({ error: 'Failed to send verification email', detail: e.message });
  }

  res.json({ ok: true });
});

router.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'email and code are required' });
  const client = await db.clients().findOne(byEmailCaseInsensitive(email));
  if (!client) return res.status(404).json({ error: 'Account not found' });
  if (client.verified) return res.status(400).json({ error: 'Account already verified' });
  if (!client.otpCode || Date.now() > client.otpExpiresAt) {
    return res.status(400).json({ error: 'Code expired, please request a new one' });
  }
  if (client.otpCode !== String(code)) {
    return res.status(400).json({ error: 'Invalid code' });
  }

  const update = { verified: true, otpCode: null, otpExpiresAt: null };
  await db.clients().updateOne({ id: client.id }, { $set: update });

  res.json(publicClient({ ...client, ...update }));
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' });
  const client = await db.clients().findOne({ username });
  if (!client) return res.status(401).json({ error: 'Invalid username or password' });
  const ok = await bcrypt.compare(password, client.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid username or password' });
  if (!client.verified) return res.status(403).json({ error: 'Account not verified' });
  res.json(publicClient(client));
});

module.exports = router;
