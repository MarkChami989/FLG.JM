const { Server } = require('socket.io');
const db = require('../db');

const DISCONNECT_GRACE_MS = 5000;

let io = null;
const presence = new Map(); // clientId -> Set<socketId>
const disconnectTimers = new Map(); // clientId -> Timeout

function getIO() {
  if (!io) throw new Error('Sockets not initialized yet — call initSockets() first');
  return io;
}

async function contactIds(clientId) {
  const requests = await db.chatRequests().find({
    status: 'accepted',
    $or: [{ fromId: clientId }, { toId: clientId }],
  }).toArray();
  return requests.map((r) => (r.fromId === clientId ? r.toId : r.fromId));
}

function initSockets(httpServer) {
  io = new Server(httpServer, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    let identifiedId = null;

    socket.on('identify', async ({ id, username }) => {
      if (!id || !username) return;
      identifiedId = id;

      const timer = disconnectTimers.get(id);
      if (timer) {
        clearTimeout(timer);
        disconnectTimers.delete(id);
      }

      const wasOffline = !presence.has(id) || presence.get(id).size === 0;
      if (!presence.has(id)) presence.set(id, new Set());
      presence.get(id).add(socket.id);

      socket.join(`user:${id}`);
      const conversations = await db.conversations().find({ participants: id }, { projection: { id: 1 } }).toArray();
      conversations.forEach((c) => socket.join(`conv:${c.id}`));

      if (wasOffline) {
        const contacts = await contactIds(id);
        contacts.forEach((cid) => io.to(`user:${cid}`).emit('presence:online', { userId: id }));
      }
    });

    socket.on('conversation:join', ({ conversationId }) => {
      if (conversationId) socket.join(`conv:${conversationId}`);
    });

    socket.on('presence:query', ({ userIds }) => {
      if (!Array.isArray(userIds)) return;
      const online = userIds.filter((id) => presence.has(id) && presence.get(id).size > 0);
      socket.emit('presence:snapshot', { online });
    });

    socket.on('typing:start', ({ conversationId }) => {
      if (!conversationId || !identifiedId) return;
      socket.to(`conv:${conversationId}`).emit('typing:update', { conversationId, userId: identifiedId, typing: true });
    });

    socket.on('typing:stop', ({ conversationId }) => {
      if (!conversationId || !identifiedId) return;
      socket.to(`conv:${conversationId}`).emit('typing:update', { conversationId, userId: identifiedId, typing: false });
    });

    socket.on('disconnect', () => {
      if (!identifiedId) return;
      const sockets = presence.get(identifiedId);
      if (!sockets) return;
      sockets.delete(socket.id);
      if (sockets.size > 0) return;

      const timer = setTimeout(async () => {
        disconnectTimers.delete(identifiedId);
        const stillOffline = !presence.has(identifiedId) || presence.get(identifiedId).size === 0;
        if (!stillOffline) return;
        presence.delete(identifiedId);
        await db.clients().updateOne({ id: identifiedId }, { $set: { lastSeenAt: Date.now() } });
        const contacts = await contactIds(identifiedId);
        contacts.forEach((cid) => io.to(`user:${cid}`).emit('presence:offline', { userId: identifiedId }));
      }, DISCONNECT_GRACE_MS);
      disconnectTimers.set(identifiedId, timer);
    });
  });

  return io;
}

module.exports = { initSockets, getIO };
