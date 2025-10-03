# 🚀 Deployment Fix Guide for Render.com

## ⚠️ Current Issue
Your Render deployment is returning "Endpoint not found" errors because:
1. The deployed code might be outdated
2. Environment variables might not be properly set
3. The build might have failed silently

## 🔧 Step-by-Step Fix

### 1. Verify Local Setup Works
```bash
# Test locally first
npm run dev

# Test these endpoints:
curl "http://localhost:10000/health"
curl "http://localhost:10000/test"
curl -X POST "http://localhost:10000/auth/signup" -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
```

### 2. Push Latest Code to GitHub
```bash
git add .
git commit -m "Fix routing and add comprehensive error handling"
git push origin main
```

### 3. Redeploy on Render
1. **Go to your Render dashboard**
2. **Find your express-email-system service**
3. **Click "Manual Deploy" → "Deploy latest commit"**
4. **Wait for deployment to complete**

### 4. Verify Environment Variables
Make sure these are set in your Render dashboard:

```bash
# Server
PORT=10000
APP_URL=https://express-email-system.onrender.com
NODE_ENV=production

# Branding
BRAND_NAME=Tayyab
BRAND_PRIMARY=#E10600
BRAND_SECONDARY=#2C2C2C

# JWT (your secure secret)
JWT_SECRET=b4932d07ad4c7cbd4700810a7c92f4039ce485cc29dddcaf5e95130e899d36c253a04db5c9844ebe5c307660b08ea3aad72c575e37e16d23069ad38392a64d4b
JWT_EXPIRES_IN=1d

# SMTP
SMTP_HOST=smtp.stackmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=own@getyourwear.com
SMTP_PASS=Qazplm123
FROM_NAME=Tayyab
FROM_EMAIL=own@getyourwear.com
```

### 5. Check Build Logs
1. **In Render dashboard → Your service**
2. **Click "Logs" tab**
3. **Look for any error messages during build/startup**
4. **Should see: "✅ SMTP server is ready to send emails"**

### 6. Test Deployment
After redeployment, test these URLs:

```bash
# Health check
https://express-email-system.onrender.com/health

# Welcome page
https://express-email-system.onrender.com/

# Test interface
https://express-email-system.onrender.com/test

# API signup
curl -X POST "https://express-email-system.onrender.com/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## 🔍 Common Issues & Solutions

### Issue: "Endpoint not found"
**Solution:** The routes aren't loaded properly
- Check if all route files exist in `/src/routes/`
- Verify imports in `index.js`
- Redeploy with latest code

### Issue: 500 Internal Server Error
**Solution:** Missing environment variables
- Check all required env vars are set
- Look at Render logs for specific error messages

### Issue: Email sending fails
**Solution:** SMTP configuration
- Verify SMTP credentials are correct
- Check if SMTP provider allows connections from Render IPs

## 📞 Quick Test Script
Save this as `test-api.js` and run `node test-api.js`:

```javascript
const baseUrl = 'https://express-email-system.onrender.com';

async function testEndpoints() {
  const endpoints = [
    { method: 'GET', path: '/health' },
    { method: 'GET', path: '/' },
    { method: 'GET', path: '/test' },
    { method: 'GET', path: '/api/v1/status' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(baseUrl + endpoint.path);
      console.log(`${endpoint.method} ${endpoint.path}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`${endpoint.method} ${endpoint.path}: ERROR - ${error.message}`);
    }
  }
}

testEndpoints();
```

## 🎯 Expected Working URLs
After fix, these should all work:
- ✅ `https://express-email-system.onrender.com/` (Welcome page)
- ✅ `https://express-email-system.onrender.com/health` (Health check)
- ✅ `https://express-email-system.onrender.com/test` (Test interface)
- ✅ `https://express-email-system.onrender.com/auth/signup` (POST endpoint)
- ✅ `https://express-email-system.onrender.com/api/v1/status` (API info)

If issues persist, check the Render logs and look for specific error messages.