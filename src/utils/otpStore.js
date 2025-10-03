// Simple in-memory OTP store with TTL. For production, replace with Redis or DB.
const store = new Map(); // key: email, value: { otp, expiresAt, attempts }

export function setOTP(email, otp, ttlMs) {
  const expiresAt = Date.now() + ttlMs;
  const normalizedEmail = email.toLowerCase();
  
  store.set(normalizedEmail, { 
    otp: String(otp), 
    expiresAt,
    attempts: 0,
    createdAt: Date.now()
  });
  
  console.log(`🔐 OTP generated for ${normalizedEmail} (expires in ${Math.round(ttlMs / 1000 / 60)} minutes)`);
}

export function verifyOTP(email, otp) {
  const normalizedEmail = email.toLowerCase();
  const record = store.get(normalizedEmail);
  
  if (!record) {
    console.log(`❌ OTP verification failed for ${normalizedEmail}: No OTP found`);
    return false;
  }
  
  // Check if expired
  if (Date.now() > record.expiresAt) {
    store.delete(normalizedEmail);
    console.log(`❌ OTP verification failed for ${normalizedEmail}: Expired`);
    return false;
  }
  
  // Increment attempts
  record.attempts++;
  
  // Check if too many attempts (max 5)
  if (record.attempts > 5) {
    store.delete(normalizedEmail);
    console.log(`❌ OTP verification failed for ${normalizedEmail}: Too many attempts`);
    return false;
  }
  
  const isValid = record.otp === String(otp);
  
  if (isValid) {
    store.delete(normalizedEmail); // one-time use
    console.log(`✅ OTP verified successfully for ${normalizedEmail}`);
  } else {
    console.log(`❌ OTP verification failed for ${normalizedEmail}: Invalid code (attempt ${record.attempts}/5)`);
  }
  
  return isValid;
}

export function cleanupExpired() {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [email, record] of store.entries()) {
    if (now > record.expiresAt) {
      store.delete(email);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned up ${cleanedCount} expired OTP(s)`);
  }
}

// Cleanup every minute
setInterval(cleanupExpired, 60_000).unref();

// Initial cleanup
cleanupExpired();
