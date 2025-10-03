# 🚀 Render Deployment Fix for SMTP Timeout

## Issue: Connection timeout on live server
The error "Connection timeout" happens because Render's network sometimes blocks certain SMTP connections.

## Solutions (try in order):

### Option 1: Update Environment Variables (Try This First)
Add these to your Render environment variables:

```
SMTP_HOST=smtp.stackmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=own@getyourwear.com
SMTP_PASS=Qazplm123
FROM_EMAIL=own@getyourwear.com
FROM_NAME=Tayyab
```

**Key Change:** Use port `587` with `SMTP_SECURE=false` instead of port `465`

### Option 2: Alternative SMTP Settings
If Option 1 doesn't work, try these settings:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-gmail@gmail.com
FROM_NAME=Tayyab
```

### Option 3: Use Resend (Recommended for production)
Resend works better with hosting platforms:

1. Sign up at https://resend.com
2. Get your API key
3. Update environment variables:

```
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Tayyab
```

### Option 4: SendGrid Alternative
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
FROM_EMAIL=verified@yourdomain.com
FROM_NAME=Tayyab
```

## Quick Test Commands:

Test locally:
```bash
node test-email.js
```

Test on Render (after deployment):
```bash
curl -X POST "https://express-email-system.onrender.com/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","type":"confirmation"}'
```

## Deployment Steps:
1. Update environment variables in Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete
4. Test the live server

## Check Logs:
In Render dashboard → Your service → "Logs" tab to see real-time error messages.