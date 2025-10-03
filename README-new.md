# 📧 Express Email System

A **production-ready** Node.js + Express.js email system with professional HTML templates for:
- **✅ Email Confirmation** → JWT-based confirmation with secure tokens
- **🎉 Welcome Emails** → Automatic welcome after successful confirmation  
- **🔐 Password Reset** → Time-limited OTP codes (10-minute expiry)

## 🚀 Live Demo & Testing

Once deployed, your API will be available with these endpoints:

### 🌐 Web Interface
- **`GET /`** → Beautiful API documentation and welcome page
- **`GET /test`** → Interactive testing interface 
- **`GET /health`** → Health check with system status

### 🔗 API Endpoints
- **`POST /auth/signup`** → Send confirmation email
- **`GET /auth/confirm?token=...`** → Verify confirmation token
- **`POST /auth/request-reset`** → Request password reset OTP
- **`POST /auth/verify-otp`** → Verify OTP code
- **`GET /auth/status?email=...`** → Check confirmation status
- **`GET /api/v1/status`** → API status and documentation
- **`GET /api/v1/docs`** → Detailed API documentation

---

## 🛠️ Quick Start (Local Development)

```bash
# Clone and setup
git clone <your-repo>
cd express-email-system
npm install

# Configure environment
cp .env.example .env
# Edit .env with your SMTP credentials

# Start development server
npm run dev

# Visit http://localhost:10000
```

### 📋 Environment Variables

```bash
# Server Configuration
PORT=10000
APP_URL=https://your-domain.com
NODE_ENV=development

# Branding
BRAND_NAME=Your Brand Name
BRAND_PRIMARY=#667eea
BRAND_SECONDARY=#2C2C2C

# JWT Security (generate a secure secret!)
JWT_SECRET=your_super_long_random_secret_here_128_characters_minimum
JWT_EXPIRES_IN=1d

# SMTP Configuration (use a real provider!)
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
FROM_NAME=Your Brand Name
FROM_EMAIL=no-reply@yourdomain.com
```

---

## 🚀 Deployment Options

### Render.com (Recommended)
1. **Push to GitHub** → Connect repository to Render
2. **Create Web Service** → Choose your repository
3. **Build Settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Environment Variables** → Add all variables from `.env.example`
5. **Deploy** → Your API will be live!

### Railway.com
1. **Import from GitHub** → Select repository
2. **Set Variables** → Add environment variables
3. **Deploy** → Automatic deployment

### Vercel/Netlify
Compatible with serverless deployment with minor modifications.

---

## 🎨 Features & Security

### ✨ Features
- **🔒 Rate Limiting** → IP-based protection (5 emails/15min, 10 OTP/15min)
- **✅ Input Validation** → Comprehensive validation with express-validator
- **🛡️ Security Headers** → Helmet.js for security
- **📱 Responsive Design** → Mobile-friendly email templates
- **🚦 Error Handling** → Graceful error handling and logging
- **📊 Health Monitoring** → Built-in health checks and system monitoring
- **🎯 CORS Ready** → Cross-origin request support
- **⚡ Performance** → Connection pooling and optimized email delivery

### 🔐 Security Features
- JWT tokens for email confirmation
- Rate limiting per IP address
- Input sanitization and validation
- Secure headers with Helmet.js
- Environment variable protection
- Graceful error handling (no data leakage)

---

## 📧 Email Deliverability

### 🏆 Recommended SMTP Providers
- **Mailgun** → Excellent deliverability
- **SendGrid** → Enterprise-grade
- **Brevo (Sendinblue)** → Great free tier
- **Resend** → Developer-friendly
- **Amazon SES** → Cost-effective for high volume

### 📈 Improve Inbox Placement
1. **Domain Authentication** → Set up SPF, DKIM, DMARC records
2. **Dedicated IP** → For high-volume sending
3. **List Hygiene** → Remove invalid emails
4. **Content Quality** → Avoid spam trigger words
5. **Engagement** → Monitor open/click rates

---

## 🏗️ Project Structure

```
src/
├── config/
│   └── email.js              # Nodemailer configuration
├── middleware/
│   ├── rateLimiter.js        # Rate limiting middleware
│   └── validation.js         # Input validation & error handling
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── api.js               # API documentation endpoints
│   └── root.js              # Root route with welcome page
├── templates/
│   ├── confirmation.html     # Email confirmation template
│   ├── welcome.html         # Welcome email template
│   └── reset.html           # Password reset template
├── utils/
│   ├── otpStore.js          # In-memory OTP storage
│   └── tokenStore.js        # Confirmation tracking
└── index.js                 # Application entry point

public/
└── test.html                # Interactive testing interface
```

---

## 🧪 Testing & Development

### Local Testing
1. **Start Server:** `npm run dev`
2. **Visit:** `http://localhost:10000`
3. **Test Interface:** `http://localhost:10000/test`
4. **API Docs:** `http://localhost:10000/api/v1/docs`

### API Testing Examples

```bash
# Send confirmation email
curl -X POST http://localhost:10000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Request password reset
curl -X POST http://localhost:10000/auth/request-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP
curl -X POST http://localhost:10000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# Check status
curl "http://localhost:10000/auth/status?email=test@example.com"
```

---

## 🔄 Production Considerations

### 🗄️ Database Integration
For production, replace in-memory stores with:
- **Redis** → For OTP storage and rate limiting
- **PostgreSQL/MySQL** → For user confirmation tracking
- **MongoDB** → For document-based storage

### 📊 Monitoring & Logging
- **Health Checks** → Built-in `/health` endpoint
- **Structured Logging** → Morgan for request logging
- **Error Tracking** → Integrate Sentry or similar
- **Performance Monitoring** → Add APM tools

### 🔄 High Availability
- **Load Balancing** → Multiple server instances
- **Queue System** → Bull/Agenda for email queue
- **Caching** → Redis for session management
- **CDN** → For static assets

---

## 👨‍💻 Author

**Tayyab** - Full-stack developer passionate about creating robust email systems

## 📄 License

MIT License - feel free to use this project for commercial and personal projects.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**⭐ If this project helped you, please give it a star!**