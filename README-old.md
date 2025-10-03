# Express Email System (Confirmation, Welcome, Password Reset OTP)

A production-ready Node.js + Express.js email system with three professional HTML templates:
- **Confirmation Email** → sent after signup with a confirmation link (JWT token)
- **Welcome Email** → sent automatically after successful confirmation
- **Password Reset Email** → one-time OTP valid for 10 minutes

## Live Endpoints (once deployed)
- `GET /health` → health check
- `POST /auth/signup` → body `{ "email": "user@example.com" }` → sends confirmation email
- `GET /auth/confirm?token=...` → verifies token, marks confirmed, sends welcome email
- `POST /auth/request-reset` → body `{ "email": "user@example.com" }` → sends OTP
- `POST /auth/verify-otp` → body `{ "email":"...", "otp":"123456" }` → verifies OTP

There is also a mini frontend at `/` for quick testing.

---

## Quick Start (Local)

```bash
npm install
cp .env.example .env
# edit .env with real SMTP provider credentials (Mailgun/SendGrid/Brevo/Resend SMTP)
npm run dev
# open http://localhost:3000
```

### Environment Variables
See `.env.example` for all variables. Critical ones:
- `APP_URL` → your deployed URL (e.g., `https://your-app.onrender.com`), used to build confirmation links
- `JWT_SECRET` → long random string for signing tokens
- `SMTP_*` and `FROM_*` → from your email provider. **Use a real provider** for Inbox placement.

---

## Deployment (Render)
1. Push this repo to GitHub.
2. Create a new **Render → Web Service** → connect the repo.
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add all **Environment Variables** from `.env.example` (use production values; set `APP_URL` to your Render URL).
6. Deploy. Open `https://your-service.onrender.com/` and test from the built-in page.

### Deployment (Railway)
1. Create a new service from GitHub repo.
2. Set `Start Command: npm start` and add environment variables.
3. Deploy and set `APP_URL` to the generated domain.

---

## Deliverability (Inbox, not Spam)
- Use a reputable provider (Mailgun, SendGrid, Brevo). Avoid generic ISP SMTP.
- Authenticate your domain with **SPF** and **DKIM** (provider dashboard).
- Use a branded **From** (e.g., `Hyder Bikes <no-reply@yourdomain.com>`).
- Avoid spammy words in subject and keep a clean HTML structure.
- Add a `List-Unsubscribe` header (already included).

---

## Project Structure

```
src/
  config/email.js        # nodemailer transporter + sendMail()
  routes/auth.js         # endpoints
  templates/*.html       # responsive email templates
  utils/otpStore.js      # in-memory OTP with TTL
  utils/tokenStore.js    # demo confirmed users set
  index.js               # app bootstrap
public/test.html         # tiny UI for testing
```

---

## Notes
- In-memory stores are for demo. For production, move OTP/tokens into Redis or a database.
- You can replace SMTP with an API-based provider if preferred.
