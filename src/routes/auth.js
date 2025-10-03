import express from 'express';
import jwt from 'jsonwebtoken';
import { sendMail } from '../config/email.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setOTP, verifyOTP } from '../utils/otpStore.js';
import { markConfirmed, isConfirmed } from '../utils/tokenStore.js';
import { emailRateLimit, otpRateLimit } from '../middleware/rateLimiter.js';
import { validateEmail, validateOTP } from '../middleware/validation.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load email templates
const confirmTpl = fs.readFileSync(path.join(__dirname,'..','templates','confirmation.html'),'utf8');
const welcomeTpl = fs.readFileSync(path.join(__dirname,'..','templates','welcome.html'),'utf8');
const resetTpl   = fs.readFileSync(path.join(__dirname,'..','templates','reset.html'),'utf8');

const BRAND_NAME = process.env.BRAND_NAME || 'Your Brand';
const BRAND_PRIMARY = process.env.BRAND_PRIMARY || '#0F62FE';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

// Template helpers
function applyBranding(html) {
  return html
    .replaceAll('VAR_PRIMARY', BRAND_PRIMARY)
    .replaceAll('{{BRAND_NAME}}', BRAND_NAME);
}

function fillCommon(html, email) {
  return html
    .replaceAll('{{EMAIL}}', email)
    .replaceAll('{{YEAR}}', String(new Date().getFullYear()));
}

// POST /auth/signup - Send confirmation email
router.post('/signup', emailRateLimit, validateEmail, async (req, res, next) => {
  try {
    const { email } = req.body;
    
    console.log(`📧 Sending confirmation email to: ${email}`);

    // Create JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { 
      expiresIn: process.env.JWT_EXPIRES_IN || '1d' 
    });
    
    const confirmUrl = `${APP_URL}/auth/confirm?token=${encodeURIComponent(token)}`;

    // Prepare email
    let html = applyBranding(confirmTpl)
      .replaceAll('{{CONFIRM_URL}}', confirmUrl);
    html = fillCommon(html, email);

    // Send email
    const info = await sendMail({
      to: email,
      subject: `Confirm your email - ${BRAND_NAME}`,
      html
    });

    console.log(`✅ Email sent successfully to ${email}`);
    console.log(`📋 Message ID: ${info.messageId}`);

    res.json({ 
      ok: true, 
      message: 'Confirmation email sent successfully',
      email: email,
      messageId: info.messageId
    });
    
  } catch (err) {
    console.error(`❌ Failed to send email:`, err.message);
    next(err);
  }
});

// GET /auth/confirm - Confirm email
router.get('/confirm', async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ ok: false, error: 'Token is required' });
    }

    let email;
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      email = payload.email;
    } catch (e) {
      return res.status(400).json({ ok: false, error: 'Invalid or expired token' });
    }

    // Check if already confirmed
    if (isConfirmed(email)) {
      return res.json({ ok: true, message: `${email} is already confirmed` });
    }

    // Mark as confirmed
    markConfirmed(email);

    // Send welcome email
    let html = applyBranding(welcomeTpl);
    html = fillCommon(html, email);

    await sendMail({
      to: email,
      subject: `Welcome to ${BRAND_NAME}! 🎉`,
      html
    });

    console.log(`✅ User confirmed and welcome email sent: ${email}`);

    res.json({ 
      ok: true, 
      message: `${email} confirmed successfully and welcome email sent` 
    });
    
  } catch (err) {
    console.error(`❌ Confirmation failed:`, err.message);
    next(err);
  }
});

// POST /auth/request-reset - Request password reset
router.post('/request-reset', emailRateLimit, validateEmail, async (req, res, next) => {
  try {
    const { email } = req.body;
    
    console.log(`🔐 Generating OTP for: ${email}`);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    setOTP(email, otp, 10 * 60 * 1000); // 10 minutes

    // Prepare email
    let html = applyBranding(resetTpl)
      .replaceAll('{{OTP}}', String(otp));
    html = fillCommon(html, email);

    // Send email
    const info = await sendMail({
      to: email,
      subject: `Password Reset Code - ${BRAND_NAME}`,
      html
    });

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    console.log(`📋 Message ID: ${info.messageId}`);

    res.json({ 
      ok: true, 
      message: 'Password reset code sent to your email',
      email: email,
      messageId: info.messageId,
      // Show OTP in development for testing
      ...(process.env.NODE_ENV === 'development' && { otp: otp })
    });
    
  } catch (err) {
    console.error(`❌ Failed to send OTP:`, err.message);
    next(err);
  }
});

// POST /auth/verify-otp - Verify OTP
router.post('/verify-otp', otpRateLimit, validateOTP, (req, res) => {
  const { email, otp } = req.body;
  
  console.log(`🔍 Verifying OTP for ${email}: ${otp}`);
  
  const isValid = verifyOTP(email, otp);
  
  if (isValid) {
    console.log(`✅ OTP verified successfully for ${email}`);
  } else {
    console.log(`❌ Invalid OTP for ${email}`);
  }
  
  res.json({ 
    ok: isValid, 
    message: isValid ? 'OTP verified successfully' : 'Invalid or expired OTP',
    email: email
  });
});

// GET /auth/status - Check confirmation status
router.get('/status', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ ok: false, error: 'Email is required' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email format' });
  }
  
  res.json({ 
    ok: true, 
    email: email.toLowerCase(),
    confirmed: isConfirmed(email.toLowerCase()) 
  });
});

export default router;
