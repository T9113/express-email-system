import { body, validationResult } from 'express-validator';

// Email validation middleware
export const validateEmail = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        ok: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];

// OTP validation middleware
export const validateOTP = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be exactly 6 digits'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        ok: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      ok: false,
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      ok: false,
      error: 'Token has expired'
    });
  }

  // Email sending errors
  if (err.message.includes('Email delivery failed')) {
    return res.status(500).json({
      ok: false,
      error: 'Failed to send email. Please try again later.'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    ok: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

// 404 handler with helpful information
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    ok: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: {
      'GET /': 'API documentation and welcome page',
      'GET /health': 'Health check',
      'GET /test': 'Interactive testing interface',
      'GET /api/v1/status': 'API status',
      'GET /api/v1/docs': 'API documentation',
      'POST /auth/signup': 'Send confirmation email',
      'GET /auth/confirm': 'Confirm email with token',
      'POST /auth/request-reset': 'Request password reset OTP',
      'POST /auth/verify-otp': 'Verify OTP',
      'GET /auth/status': 'Check email confirmation status'
    }
  });
};