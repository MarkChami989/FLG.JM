const { getDb } = require('./mongo');

function collection(name) {
  return getDb().collection(name);
}

async function nextSeq(id) {
  const result = await collection('counters').findOneAndUpdate(
    { _id: id },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  return result.seq;
}

async function nextBookingId() {
  const seq = await nextSeq('bookingSeq');
  return `FLG-${seq}`;
}

async function nextClientId() {
  const seq = await nextSeq('clientSeq');
  return `CLI-${String(seq).padStart(4, '0')}`;
}

async function nextTournamentId() {
  const seq = await nextSeq('tournamentSeq');
  return `T-${String(seq).padStart(3, '0')}`;
}

async function nextChatRequestId() {
  const seq = await nextSeq('chatRequestSeq');
  return `FR-${String(seq).padStart(4, '0')}`;
}

async function nextConversationId() {
  const seq = await nextSeq('conversationSeq');
  return `CV-${String(seq).padStart(4, '0')}`;
}

async function nextMessageId() {
  const seq = await nextSeq('messageSeq');
  return `MSG-${String(seq).padStart(6, '0')}`;
}

module.exports = {
  bookings: () => collection('bookings'),
  tournaments: () => collection('tournaments'),
  resources: () => collection('resources'),
  slotBookings: () => collection('slotBookings'),
  staff: () => collection('staff'),
  clients: () => collection('clients'),
  roomRates: () => collection('roomRates'),
  orderRates: () => collection('orderRates'),
  chatRequests: () => collection('chatRequests'),
  conversations: () => collection('conversations'),
  messages: () => collection('messages'),
  nextBookingId,
  nextClientId,
  nextTournamentId,
  nextChatRequestId,
  nextConversationId,
  nextMessageId,
};
