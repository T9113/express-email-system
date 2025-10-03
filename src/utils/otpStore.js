// Simple in-memory OTP store with TTL. For production, replace with Redis or DB.
const store = new Map(); // key: email, value: { otp, expiresAt }

export function setOTP(email, otp, ttlMs) {
  const expiresAt = Date.now() + ttlMs;
  store.set(email, { otp, expiresAt });
}

export function verifyOTP(email, otp) {
  const rec = store.get(email);
  if (!rec) return false;
  if (Date.now() > rec.expiresAt) {
    store.delete(email);
    return false;
  }
  const ok = String(rec.otp) === String(otp);
  if (ok) store.delete(email); // one-time use
  return ok;
}

export function cleanupExpired() {
  const now = Date.now();
  for (const [email, rec] of store.entries()) {
    if (now > rec.expiresAt) store.delete(email);
  }
}

setInterval(cleanupExpired, 60_000).unref();
