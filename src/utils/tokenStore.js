// Optional mapping to track 'confirmed' users without DB (for demo).
// In production, this should be stored in a database with proper persistence.
const confirmed = new Set();

export function markConfirmed(email) {
  const normalizedEmail = email.toLowerCase();
  confirmed.add(normalizedEmail);
  console.log(`✅ User confirmed: ${normalizedEmail}`);
}

export function isConfirmed(email) {
  const normalizedEmail = email.toLowerCase();
  return confirmed.has(normalizedEmail);
}

export function getConfirmedUsers() {
  return Array.from(confirmed);
}

export function removeConfirmed(email) {
  const normalizedEmail = email.toLowerCase();
  const removed = confirmed.delete(normalizedEmail);
  if (removed) {
    console.log(`❌ User confirmation removed: ${normalizedEmail}`);
  }
  return removed;
}
