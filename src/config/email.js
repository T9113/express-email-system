import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const {
  SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS,
  FROM_NAME, FROM_EMAIL
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: String(SMTP_SECURE).toLowerCase() === 'true',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100
});

export async function sendMail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: `${FROM_NAME || 'No-Reply'} <${FROM_EMAIL || 'no-reply@example.com'}>`,
    to,
    subject,
    html,
    headers: {
      'X-Entity-Ref-ID': 'express-email-system',
      'List-Unsubscribe': `<mailto:${FROM_EMAIL || 'no-reply@example.com'}?subject=unsubscribe>`
    }
  });
  return info;
}

export default transporter;
