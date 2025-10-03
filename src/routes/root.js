import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root route - API welcome page
router.get('/', (req, res) => {
  const welcomeData = {
    ok: true,
    welcome: 'Express Email System API',
    version: '1.0.0',
    author: 'Tayyab',
    brand: process.env.BRAND_NAME || 'Email System',
    description: 'Production-ready email system with confirmation, welcome, and password reset features',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    
    quickStart: {
      testInterface: `${req.protocol}://${req.get('host')}/test`,
      healthCheck: `${req.protocol}://${req.get('host')}/health`,
      apiStatus: `${req.protocol}://${req.get('host')}/api/v1/status`,
      documentation: `${req.protocol}://${req.get('host')}/api/v1/docs`
    },
    
    exampleUsage: {
      signup: {
        method: 'POST',
        url: `${req.protocol}://${req.get('host')}/auth/signup`,
        body: { email: 'user@example.com' }
      },
      confirm: {
        method: 'GET',
        url: `${req.protocol}://${req.get('host')}/auth/confirm?token=JWT_TOKEN_HERE`
      },
      resetRequest: {
        method: 'POST',
        url: `${req.protocol}://${req.get('host')}/auth/request-reset`,
        body: { email: 'user@example.com' }
      },
      verifyOTP: {
        method: 'POST',
        url: `${req.protocol}://${req.get('host')}/auth/verify-otp`,
        body: { email: 'user@example.com', otp: '123456' }
      }
    },
    
    features: [
      '✅ Email confirmation with JWT tokens',
      '✅ Welcome emails after confirmation',
      '✅ Password reset with OTP',
      '✅ Rate limiting protection',
      '✅ Input validation',
      '✅ Production-ready SMTP',
      '✅ Responsive email templates',
      '✅ Cross-platform compatibility',
      '✅ Error handling',
      '✅ Security headers'
    ],
    
    security: {
      rateLimit: 'IP-based rate limiting enabled',
      validation: 'Input validation with express-validator',
      headers: 'Security headers with helmet',
      cors: 'CORS enabled for cross-origin requests',
      jwt: 'JWT tokens for secure email confirmation'
    }
  };

  // Check if request accepts HTML
  if (req.accepts('html')) {
    return res.send(generateWelcomeHTML(welcomeData, req));
  }
  
  // Return JSON for API clients
  res.json(welcomeData);
});

function generateWelcomeHTML(data, req) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.welcome}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px; 
        }
        .header {
            text-align: center;
            background: white;
            padding: 40px 30px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        .header h1 {
            color: ${process.env.BRAND_PRIMARY || '#667eea'};
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .header p {
            color: #666;
            font-size: 1.1em;
            margin-bottom: 20px;
        }
        .badge {
            display: inline-block;
            background: ${process.env.BRAND_PRIMARY || '#667eea'};
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 600;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .card h3 {
            color: ${process.env.BRAND_PRIMARY || '#667eea'};
            margin-bottom: 15px;
            font-size: 1.3em;
        }
        .card p, .card li {
            color: #666;
            line-height: 1.6;
            margin-bottom: 10px;
        }
        .card ul {
            list-style: none;
            padding-left: 0;
        }
        .card li {
            padding: 5px 0;
        }
        .endpoint {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 4px solid ${process.env.BRAND_PRIMARY || '#667eea'};
        }
        .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            margin-right: 10px;
        }
        .method.post { background: #28a745; color: white; }
        .method.get { background: #007bff; color: white; }
        .url {
            font-family: 'Courier New', monospace;
            color: #333;
            font-weight: 500;
        }
        .btn {
            display: inline-block;
            background: ${process.env.BRAND_PRIMARY || '#667eea'};
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 10px 10px 10px 0;
            transition: background 0.3s;
        }
        .btn:hover {
            background: ${process.env.BRAND_SECONDARY || '#5a67d8'};
        }
        .footer {
            text-align: center;
            color: white;
            margin-top: 40px;
            opacity: 0.9;
        }
        @media (max-width: 768px) {
            .grid { grid-template-columns: 1fr; }
            .header h1 { font-size: 2em; }
            .container { padding: 10px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 ${data.welcome}</h1>
            <p>${data.description}</p>
            <span class="badge">v${data.version} • ${data.environment}</span>
        </div>

        <div class="grid">
            <div class="card">
                <h3>🚀 Quick Start</h3>
                <a href="/test" class="btn">Test Interface</a>
                <a href="/health" class="btn">Health Check</a>
                <a href="/api/v1/status" class="btn">API Status</a>
                <a href="/api/v1/docs" class="btn">Documentation</a>
            </div>

            <div class="card">
                <h3>🔥 Features</h3>
                <ul>
                    ${data.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>

            <div class="card">
                <h3>🔗 API Endpoints</h3>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="url">/auth/signup</span>
                    <p>Send confirmation email</p>
                </div>
                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="url">/auth/confirm</span>
                    <p>Confirm email with token</p>
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="url">/auth/request-reset</span>
                    <p>Request password reset OTP</p>
                </div>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="url">/auth/verify-otp</span>
                    <p>Verify OTP code</p>
                </div>
            </div>

            <div class="card">
                <h3>🛡️ Security</h3>
                <ul>
                    <li>✅ Rate limiting (${data.security.rateLimit})</li>
                    <li>✅ Input validation</li>
                    <li>✅ Security headers</li>
                    <li>✅ CORS protection</li>
                    <li>✅ JWT authentication</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p>Built with ❤️ by ${data.author} • Express Email System ${data.version}</p>
            <p>Environment: ${data.environment} • ${data.timestamp}</p>
        </div>
    </div>
</body>
</html>`;
}

export default router;