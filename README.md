# 📧 Simple Express Email System

A clean and simple Node.js + Express.js email system for:
- **📧 Email Confirmation** → Send confirmation emails with JWT tokens
- **🎉 Welcome Emails** → Automatic welcome after confirmation  
- **🔐 Password Reset** → OTP-based password reset (10-minute expiry)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your SMTP settings

# Start server
npm run dev

# Test at http://localhost:10000/test
```

## 📋 Environment Variables

```bash
# Server
PORT=10000
APP_URL=https://your-domain.com

# Branding
BRAND_NAME=Your Brand
BRAND_PRIMARY=#0F62FE

# JWT
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=1d

# SMTP (Required!)
SMTP_HOST=smtp.stackmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_username
SMTP_PASS=your_password
FROM_NAME=Your Brand
FROM_EMAIL=your@email.com
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API info |
| `GET` | `/health` | Health check |
| `GET` | `/test` | Test interface |
| `POST` | `/auth/signup` | Send confirmation email |
| `GET` | `/auth/confirm?token=...` | Confirm email |
| `POST` | `/auth/request-reset` | Send reset OTP |
| `POST` | `/auth/verify-otp` | Verify OTP |
| `GET` | `/auth/status?email=...` | Check status |

## 🧪 Testing

### Test Email Configuration
```bash
node test-email.js
```

### Test API Endpoints
```bash
# Send confirmation
curl -X POST http://localhost:10000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Send OTP
curl -X POST http://localhost:10000/auth/request-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP
curl -X POST http://localhost:10000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

## 🚀 Deployment

### Render.com
1. Push to GitHub
2. Create Web Service on Render
3. Build: `npm install`
4. Start: `npm start` 
5. Add environment variables
6. Deploy!

### Railway/Vercel
Similar process - just set environment variables and deploy.

## 📁 Project Structure

```
src/
├── config/email.js       # Email configuration
├── templates/            # HTML email templates
│   ├── confirmation.html
│   ├── welcome.html
│   └── reset.html
└── index.js             # Main server file (all routes here)

public/test.html         # Test interface
test-email.js           # Email testing script
```

## ⚡ Features

- **Simple & Clean** → All code in one file
- **No Complex Middleware** → Just the essentials
- **Working Email** → Tested and verified
- **Easy to Understand** → Clear, readable code
- **Production Ready** → Works on Render/Railway
- **Built-in Testing** → Test interface included

## 🎯 Perfect For

- Small to medium projects
- Learning email integration
- Quick email system setup
- Prototype development
- Simple authentication flows

---

**💡 This project follows the "keep it simple" philosophy - everything works out of the box!**