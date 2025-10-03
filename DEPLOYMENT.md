# Render Deployment Configuration

This file documents the deployment settings for Render.com

## Build Settings
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Node Version:** 18.x or higher

## Environment Variables
Set these in your Render dashboard:

```bash
# Server
PORT=10000
APP_URL=https://your-service-name.onrender.com
NODE_ENV=production

# Branding  
BRAND_NAME=Tayyab
BRAND_PRIMARY=#E10600
BRAND_SECONDARY=#2C2C2C

# JWT (generate a new secure secret)
JWT_SECRET=your_super_long_random_jwt_secret_here
JWT_EXPIRES_IN=1d

# SMTP Configuration
SMTP_HOST=smtp.stackmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
FROM_NAME=Tayyab
FROM_EMAIL=your_from_email@domain.com
```

## Deployment Steps
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set the build and start commands above
4. Add all environment variables
5. Deploy!

## Health Check
Your app will be available at: `https://your-service-name.onrender.com/health`

## Testing
Use the built-in test interface at: `https://your-service-name.onrender.com/`