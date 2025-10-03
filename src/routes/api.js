import express from 'express';

const router = express.Router();

// API status endpoint
router.get('/status', (req, res) => {
  res.json({
    ok: true,
    service: 'Express Email System',
    version: '1.0.0',
    author: 'Tayyab',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    features: [
      'Email confirmation',
      'Welcome emails',
      'Password reset OTP',
      'Rate limiting',
      'Input validation',
      'SMTP integration'
    ],
    endpoints: {
      auth: {
        'POST /auth/signup': 'Send confirmation email',
        'GET /auth/confirm': 'Confirm email with token',
        'POST /auth/request-reset': 'Request password reset OTP',
        'POST /auth/verify-otp': 'Verify OTP',
        'GET /auth/status': 'Check email confirmation status'
      },
      system: {
        'GET /health': 'Health check',
        'GET /api/v1/status': 'API status',
        'GET /': 'API documentation'
      }
    }
  });
});

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    ok: true,
    documentation: {
      title: 'Express Email System API',
      version: '1.0.0',
      description: 'A production-ready email system with confirmation, welcome, and password reset features',
      baseUrl: process.env.APP_URL || 'http://localhost:10000',
      authentication: 'JWT tokens for email confirmation',
      rateLimit: {
        email: '5 requests per 15 minutes',
        otp: '10 requests per 15 minutes',
        general: '100 requests per 15 minutes'
      },
      endpoints: [
        {
          method: 'POST',
          path: '/auth/signup',
          description: 'Send confirmation email to user',
          body: {
            email: 'string (required) - Valid email address'
          },
          response: {
            ok: 'boolean',
            message: 'string',
            tokenPreview: 'string (development only)'
          }
        },
        {
          method: 'GET',
          path: '/auth/confirm',
          description: 'Confirm email address with JWT token',
          query: {
            token: 'string (required) - JWT confirmation token'
          },
          response: {
            ok: 'boolean',
            message: 'string'
          }
        },
        {
          method: 'POST',
          path: '/auth/request-reset',
          description: 'Request password reset OTP',
          body: {
            email: 'string (required) - Valid email address'
          },
          response: {
            ok: 'boolean',
            message: 'string'
          }
        },
        {
          method: 'POST',
          path: '/auth/verify-otp',
          description: 'Verify password reset OTP',
          body: {
            email: 'string (required) - Valid email address',
            otp: 'string (required) - 6-digit OTP code'
          },
          response: {
            ok: 'boolean',
            message: 'string'
          }
        },
        {
          method: 'GET',
          path: '/auth/status',
          description: 'Check email confirmation status',
          query: {
            email: 'string (required) - Valid email address'
          },
          response: {
            ok: 'boolean',
            email: 'string',
            confirmed: 'boolean'
          }
        }
      ]
    }
  });
});

export default router;