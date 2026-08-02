const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../mailer');

const router = express.Router();
const OTP_TTL_MS = 10 * 60 * 1000;

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const settingsOtps = new Map(); // clientId -> { code, expiresAt }

function publicClient(c) {
  const { passwordHash, otpCode, otpExpiresAt, faceDescriptor, _id, ...pub } = c;
  return pub;
}

function byEmailCaseInsensitive(email) {
  return { $expr: { $eq: [{ $toLower: '$email' }, email.toLowerCase()] } };
}

const FACE_MATCH_THRESHOLD = 0.5;

function euclideanDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
  return Math.sqrt(sum);
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

  let emailWarning = null;
  try {
    await sendVerificationEmail(email, otpCode);
  } catch (e) {
    emailWarning = 'Account created, but the verification email could not be sent. Use "Resend code" on the next screen.';
  }

  res.status(201).json({ ...publicClient(client), emailWarning });
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

  let emailWarning = null;
  try {
    await sendVerificationEmail(client.email, otpCode);
  } catch (e) {
    emailWarning = 'Failed to send verification email. Please try again shortly.';
  }

  res.json({ ok: true, emailWarning });
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

router.post('/face/enroll', async (req, res) => {
  const { email, descriptor } = req.body;
  if (!email || !Array.isArray(descriptor) || descriptor.length !== 128) {
    return res.status(400).json({ error: 'email and a 128-value face descriptor are required' });
  }
  const client = await db.clients().findOne(byEmailCaseInsensitive(email));
  if (!client) return res.status(404).json({ error: 'Account not found' });

  await db.clients().updateOne({ id: client.id }, { $set: { faceDescriptor: descriptor } });
  res.json({ ok: true });
});

router.post('/face/login', async (req, res) => {
  const { descriptor } = req.body;
  if (!Array.isArray(descriptor) || descriptor.length !== 128) {
    return res.status(400).json({ error: 'a 128-value face descriptor is required' });
  }

  const candidates = await db.clients().find({ faceDescriptor: { $exists: true } }).toArray();
  let best = null;
  let bestDistance = Infinity;
  for (const c of candidates) {
    const distance = euclideanDistance(c.faceDescriptor, descriptor);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = c;
    }
  }

  if (!best || bestDistance > FACE_MATCH_THRESHOLD) {
    return res.status(401).json({ error: 'Face not recognized' });
  }
  if (!best.verified) return res.status(403).json({ error: 'Account not verified' });

  res.json(publicClient(best));
});

router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email is required' });
  const client = await db.clients().findOne(byEmailCaseInsensitive(email));
  if (!client) return res.status(404).json({ error: 'No account found with this email' });

  const resetCode = genOtp();
  const resetCodeExpiresAt = Date.now() + OTP_TTL_MS;
  await db.clients().updateOne({ id: client.id }, { $set: { resetCode, resetCodeExpiresAt } });

  try {
    await sendPasswordResetEmail(client.email, resetCode);
  } catch (e) {
    return res.status(502).json({ error: 'Could not send reset email', detail: e.message });
  }

  res.json({ ok: true });
});

router.post('/forgot/verify', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'email and code are required' });
  const client = await db.clients().findOne(byEmailCaseInsensitive(email));
  if (!client) return res.status(404).json({ error: 'No account found with this email' });
  if (!client.resetCode || Date.now() > client.resetCodeExpiresAt) {
    return res.status(400).json({ error: 'Code expired, please request a new one' });
  }
  if (client.resetCode !== String(code)) {
    return res.status(400).json({ error: 'Invalid code' });
  }

  res.json({ ok: true });
});

router.post('/forgot/reset', async (req, res) => {
  const { email, code, password } = req.body;
  if (!email || !code || !password) {
    return res.status(400).json({ error: 'email, code and password are required' });
  }
  const client = await db.clients().findOne(byEmailCaseInsensitive(email));
  if (!client) return res.status(404).json({ error: 'No account found with this email' });
  if (!client.resetCode || Date.now() > client.resetCodeExpiresAt) {
    return res.status(400).json({ error: 'Code expired, please request a new one' });
  }
  if (client.resetCode !== String(code)) {
    return res.status(400).json({ error: 'Invalid code' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.clients().updateOne(
    { id: client.id },
    { $set: { passwordHash }, $unset: { resetCode: '', resetCodeExpiresAt: '' } }
  );

  res.json({ ok: true });
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

// ---- Settings: change password (verify current password FIRST, then email a code) ----
router.post('/settings/password/send-code', async (req, res) => {
  const { clientId, currentPassword } = req.body;
  if (!clientId || !currentPassword) return res.status(400).json({ error: 'clientId and currentPassword are required' });

  const client = await db.clients().findOne({ id: clientId });
  if (!client) return res.status(404).json({ error: 'Account not found' });
  const ok = await bcrypt.compare(currentPassword, client.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Current password is incorrect' });

  const code = genOtp();
  settingsOtps.set(clientId, { code, expiresAt: Date.now() + OTP_TTL_MS });

  try {
    await sendVerificationEmail(client.email, code);
  } catch (e) {
    return res.status(502).json({ error: 'Failed to send verification email', detail: e.message });
  }

  res.json({ ok: true, email: client.email });
});

router.post('/settings/password/change', async (req, res) => {
  const { clientId, code, newPassword, confirmPassword } = req.body;
  if (!clientId || !code || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: 'clientId, code, newPassword and confirmPassword are required' });
  }
  const pending = settingsOtps.get(clientId);
  if (!pending || Date.now() > pending.expiresAt) {
    return res.status(400).json({ error: 'Code expired, please request a new one' });
  }
  if (pending.code !== String(code)) {
    return res.status(400).json({ error: 'Invalid code' });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.clients().updateOne({ id: clientId }, { $set: { passwordHash } });
  settingsOtps.delete(clientId);

  res.json({ ok: true });
});

// ---- Settings: profile picture ----
router.post('/settings/profile-picture', async (req, res) => {
  const { clientId, image } = req.body;
  if (!clientId || !image) return res.status(400).json({ error: 'clientId and image are required' });

  const client = await db.clients().findOneAndUpdate(
    { id: clientId },
    { $set: { profilePicture: image } },
    { returnDocument: 'after' }
  );
  if (!client) return res.status(404).json({ error: 'Account not found' });
  res.json(publicClient(client));
});

module.exports = router;
