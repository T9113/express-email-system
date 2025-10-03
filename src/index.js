import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendMail } from './config/email.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load email templates
const confirmTpl = fs.readFileSync(path.join(__dirname, 'templates', 'confirmation.html'), 'utf8');
const welcomeTpl = fs.readFileSync(path.join(__dirname, 'templates', 'welcome.html'), 'utf8');
const resetTpl = fs.readFileSync(path.join(__dirname, 'templates', 'reset.html'), 'utf8');

// In-memory storage (like test-email.js approach)
const otpStore = new Map(); // email -> { otp, expiresAt }
const confirmedUsers = new Set(); // confirmed emails

// Template helpers
function applyBranding(html) {
  return html
    .replaceAll('VAR_PRIMARY', process.env.BRAND_PRIMARY || '#0F62FE')
    .replaceAll('{{BRAND_NAME}}', process.env.BRAND_NAME || 'Email System');
}

function fillCommon(html, email) {
  return html
    .replaceAll('{{EMAIL}}', email)
    .replaceAll('{{YEAR}}', String(new Date().getFullYear()));
}

// Serve test page
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'test.html'));
});

// Simple welcome page
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'Express Email System API',
    brand: process.env.BRAND_NAME || 'Email System',
    endpoints: {
      'GET /health': 'Health check',
      'GET /test': 'Test interface',
      'POST /auth/signup': 'Send confirmation email',
      'GET /auth/confirm': 'Confirm email with token',
      'POST /auth/request-reset': 'Request password reset OTP',
      'POST /auth/verify-otp': 'Verify OTP'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    smtp: process.env.SMTP_HOST || 'not configured'
  });
});

// POST /auth/signup - Send confirmation email (like test-email.js)
app.post('/auth/signup', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ ok: false, error: 'Email is required' });
    }
    
    console.log(`📧 Sending confirmation email to: ${email}`);

    // Create JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const confirmUrl = `${process.env.APP_URL || 'http://localhost:3000'}/auth/confirm?token=${token}`;

    // Prepare email (same approach as test-email.js)
    let html = applyBranding(confirmTpl).replaceAll('{{CONFIRM_URL}}', confirmUrl);
    html = fillCommon(html, email);

    // Send email (same as test-email.js)
    const result = await sendMail({
      to: email,
      subject: `Confirm your email - ${process.env.BRAND_NAME || 'Email System'}`,
      html
    });

    console.log(`✅ Confirmation email sent to ${email}`);
    console.log(`📋 Message ID: ${result.messageId}`);

    res.json({ 
      ok: true, 
      message: 'Confirmation email sent successfully',
      email: email,
      messageId: result.messageId
    });
    
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error.message);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to send email' 
    });
  }
});

// GET /auth/confirm - Confirm email
app.get('/auth/confirm', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ ok: false, error: 'Token is required' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const email = payload.email;

    // Mark as confirmed
    confirmedUsers.add(email.toLowerCase());

    // Send welcome email (same as test-email.js approach)
    let html = applyBranding(welcomeTpl);
    html = fillCommon(html, email);

    const result = await sendMail({
      to: email,
      subject: `Welcome to ${process.env.BRAND_NAME || 'Email System'}! 🎉`,
      html
    });

    console.log(`✅ User confirmed and welcome email sent: ${email}`);
    console.log(`📋 Message ID: ${result.messageId}`);

    res.json({ 
      ok: true, 
      message: `${email} confirmed successfully and welcome email sent`
    });
    
  } catch (error) {
    console.error('❌ Confirmation failed:', error.message);
    res.status(400).json({ 
      ok: false, 
      error: 'Invalid or expired token' 
    });
  }
});

// POST /auth/request-reset - Request password reset (like test-email.js)
app.post('/auth/request-reset', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ ok: false, error: 'Email is required' });
    }
    
    console.log(`� Generating OTP for: ${email}`);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes
    
    otpStore.set(email.toLowerCase(), { otp, expiresAt });

    // Prepare email (same as test-email.js)
    let html = applyBranding(resetTpl).replaceAll('{{OTP}}', String(otp));
    html = fillCommon(html, email);

    // Send email (same as test-email.js)
    const result = await sendMail({
      to: email,
      subject: `Password Reset Code - ${process.env.BRAND_NAME || 'Email System'}`,
      html
    });

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    console.log(`� Message ID: ${result.messageId}`);

    res.json({ 
      ok: true, 
      message: 'Password reset code sent to your email',
      email: email,
      messageId: result.messageId,
      // Show OTP in development for testing
      ...(process.env.NODE_ENV === 'development' && { otp: otp })
    });
    
  } catch (error) {
    console.error('❌ Failed to send OTP:', error.message);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to send reset code' 
    });
  }
});

// POST /auth/verify-otp - Verify OTP
app.post('/auth/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ ok: false, error: 'Email and OTP are required' });
    }
    
    console.log(`� Verifying OTP for ${email}: ${otp}`);
    
    const stored = otpStore.get(email.toLowerCase());
    
    if (!stored) {
      console.log(`❌ No OTP found for ${email}`);
      return res.json({ ok: false, message: 'Invalid or expired OTP' });
    }
    
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email.toLowerCase());
      console.log(`❌ OTP expired for ${email}`);
      return res.json({ ok: false, message: 'Invalid or expired OTP' });
    }
    
    if (String(stored.otp) !== String(otp)) {
      console.log(`❌ Invalid OTP for ${email}`);
      return res.json({ ok: false, message: 'Invalid or expired OTP' });
    }
    
    // Valid OTP
    otpStore.delete(email.toLowerCase());
    console.log(`✅ OTP verified successfully for ${email}`);
    
    res.json({ 
      ok: true, 
      message: 'OTP verified successfully',
      email: email
    });
    
  } catch (error) {
    console.error('❌ OTP verification error:', error.message);
    res.status(500).json({ 
      ok: false, 
      error: 'Verification failed' 
    });
  }
});

// GET /auth/status - Check confirmation status
app.get('/auth/status', (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({ ok: false, error: 'Email is required' });
  }
  
  res.json({ 
    ok: true, 
    email: email.toLowerCase(),
    confirmed: confirmedUsers.has(email.toLowerCase()) 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /health', 
      'GET /test',
      'POST /auth/signup',
      'GET /auth/confirm',
      'POST /auth/request-reset',
      'POST /auth/verify-otp',
      'GET /auth/status'
    ]
  });
});

// Start server (like test-email.js)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 SMTP: ${process.env.SMTP_HOST || 'Not configured'}`);
  console.log(`🔗 Test: http://localhost:${PORT}/test`);
});
