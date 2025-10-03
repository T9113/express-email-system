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

const confirmTpl = fs.readFileSync(path.join(__dirname,'..','templates','confirmation.html'),'utf8');
const welcomeTpl = fs.readFileSync(path.join(__dirname,'..','templates','welcome.html'),'utf8');
const resetTpl   = fs.readFileSync(path.join(__dirname,'..','templates','reset.html'),'utf8');

const BRAND_NAME = process.env.BRAND_NAME || 'Your Brand';
const BRAND_PRIMARY = process.env.BRAND_PRIMARY || '#0F62FE';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

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

// POST /auth/signup { email }
router.post('/signup', emailRateLimit, validateEmail, async (req, res, next) => {
  try {
    const { email } = req.body;

    // Create a JWT confirmation token
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'dev', { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    const confirmUrl = `${APP_URL}/auth/confirm?token=${encodeURIComponent(token)}`;

    let html = applyBranding(confirmTpl)
      .replaceAll('{{CONFIRM_URL}}', confirmUrl);
    html = fillCommon(html, email);

    await sendMail({
      to: email,
      subject: `Confirm your email - ${BRAND_NAME}`,
      html
    });

    return res.json({ 
      ok: true, 
      message: 'Confirmation email sent successfully',
      // Only include token preview in development
      ...(process.env.NODE_ENV !== 'production' && { tokenPreview: token })
    });
  } catch (err) {
    next(err);
  }
});

// GET /auth/confirm?token=...
router.get('/confirm', async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ ok: false, error: 'Token is required' });

    let email;
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev');
      email = payload.email;
    } catch (e) {
      return res.status(400).json({ ok: false, error: 'Invalid or expired token' });
    }

    // Check if already confirmed
    if (isConfirmed(email)) {
      return res.json({ ok: true, message: `${email} is already confirmed` });
    }

    // Mark confirmed (demo)
    markConfirmed(email);

    // Send welcome email
    let html = applyBranding(welcomeTpl);
    html = fillCommon(html, email);

    await sendMail({
      to: email,
      subject: `Welcome to ${BRAND_NAME}! 🎉`,
      html
    });

    return res.json({ ok: true, message: `${email} confirmed successfully and welcome email sent` });
  } catch (err) {
    next(err);
  }
});

// POST /auth/request-reset { email }
router.post('/request-reset', emailRateLimit, validateEmail, async (req, res, next) => {
  try {
    const { email } = req.body;

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    setOTP(email, otp, 10 * 60 * 1000); // 10 minutes

    let html = applyBranding(resetTpl)
      .replaceAll('{{OTP}}', String(otp));
    html = fillCommon(html, email);

    await sendMail({
      to: email,
      subject: `Password Reset Code - ${BRAND_NAME}`,
      html
    });

    return res.json({ ok: true, message: 'Password reset code sent to your email' });
  } catch (err) {
    next(err);
  }
});

// POST /auth/verify-otp { email, otp }
router.post('/verify-otp', otpRateLimit, validateOTP, (req, res) => {
  const { email, otp } = req.body;
  
  const isValid = verifyOTP(email, otp);
  
  return res.json({ 
    ok: isValid, 
    message: isValid ? 'OTP verified successfully' : 'Invalid or expired OTP' 
  });
});

// GET /auth/status?email=...
router.get('/status', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ ok: false, error: 'Email is required' });
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email format' });
  }
  
  return res.json({ 
    ok: true, 
    email: email.toLowerCase(),
    confirmed: isConfirmed(email.toLowerCase()) 
  });
});

export default router;
