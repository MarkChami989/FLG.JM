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

module.exports = {
  bookings: () => collection('bookings'),
  tournaments: () => collection('tournaments'),
  resources: () => collection('resources'),
  slotBookings: () => collection('slotBookings'),
  staff: () => collection('staff'),
  clients: () => collection('clients'),
  nextBookingId,
  nextClientId,
  nextTournamentId,
};
