const express = require('express');
const db = require('../db');

const router = express.Router();

function broadcast(conversationId, message) {
  try { require('../sockets').getIO().to(`conv:${conversationId}`).emit('message:new', message); } catch {}
}

router.get('/conversations', async (req, res) => {
  const { status } = req.query;
  const filter = { type: 'support' };
  if (status) filter.status = status;
  const list = await db.conversations().find(filter, { projection: { _id: 0 } }).sort({ updatedAt: -1 }).toArray();
  res.json(list);
});

router.get('/conversations/:id/messages', async (req, res) => {
  const conversation = await db.conversations().findOne({ id: req.params.id, type: 'support' });
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
  const list = await db.messages().find({ conversationId: req.params.id }, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
  res.json(list);
});

router.post('/conversations/:id/reply', async (req, res) => {
  const { staffId, staffName, role, text } = req.body;
  if (!staffId || !staffName || !text || !String(text).trim()) {
    return res.status(400).json({ error: 'staffId, staffName and text are required' });
  }
  const conversation = await db.conversations().findOne({ id: req.params.id, type: 'support' });
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

  const message = {
    id: await db.nextMessageId(),
    conversationId: req.params.id,
    fromId: staffId,
    fromUsername: staffName,
    fromRole: role || 'staff',
    text: String(text).trim(),
    createdAt: Date.now(),
    readBy: [staffId],
  };
  await db.messages().insertOne(message);

  const update = {
    lastMessage: { text: message.text, fromId: staffId, createdAt: message.createdAt },
    updatedAt: message.createdAt,
  };
  if (conversation.status !== 'escalated') update.status = 'escalated';
  if (!conversation.assignedStaffId) {
    update.assignedStaffId = staffId;
    update.assignedStaffName = staffName;
  }
  await db.conversations().updateOne({ id: req.params.id }, { $set: update });

  broadcast(req.params.id, message);
  const { _id, ...pub } = message;
  res.status(201).json(pub);
});

router.post('/conversations/:id/close', async (req, res) => {
  const conversation = await db.conversations().findOneAndUpdate(
    { id: req.params.id, type: 'support' },
    { $set: { status: 'closed' } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
  res.json(conversation);
});

module.exports = router;
