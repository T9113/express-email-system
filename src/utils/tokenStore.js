// Optional mapping to track 'confirmed' users without DB (for demo).
const confirmed = new Set();

export function markConfirmed(email) {
  confirmed.add(email);
}

export function isConfirmed(email) {
  return confirmed.has(email);
}
