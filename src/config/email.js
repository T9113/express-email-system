import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const {
  SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS,
  FROM_NAME, FROM_EMAIL
} = process.env;

// Validate required environment variables
if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !FROM_EMAIL) {
  console.error('❌ Missing required SMTP configuration');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: String(SMTP_SECURE).toLowerCase() === 'true',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  },
  // Add timeout and connection settings for better reliability
  connectionTimeout: 60000,  // 60 seconds
  greetingTimeout: 30000,    // 30 seconds  
  socketTimeout: 60000,      // 60 seconds
  pool: true,                // Use connection pooling
  maxConnections: 1,         // Limit concurrent connections
  maxMessages: 3,            // Max messages per connection
  rateLimit: 1,              // Max 1 message per second
  
  // Add retry and error handling
  tls: {
    rejectUnauthorized: false // Accept self-signed certificates
  }
});

// Test connection on startup (with timeout)
const testConnection = async () => {
  try {
    console.log('🔧 Testing SMTP connection...');
    await Promise.race([
      transporter.verify(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection test timeout')), 15000)
      )
    ]);
    console.log('✅ SMTP connection verified');
  } catch (error) {
    console.log('⚠️ SMTP connection test failed:', error.message);
    console.log('📧 Will attempt to send emails anyway...');
  }
};

export async function sendMail({ to, subject, html }) {
  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📧 Using SMTP: ${SMTP_HOST}:${SMTP_PORT}`);
    
    // Add timeout wrapper
    const sendPromise = transporter.sendMail({
      from: `${FROM_NAME || 'No-Reply'} <${FROM_EMAIL}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      headers: {
        'X-Mailer': 'Express Email System',
        'X-Priority': '3'
      }
    });
    
    // Race between sending and timeout
    const info = await Promise.race([
      sendPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout after 45 seconds')), 45000)
      )
    ]);
    
    console.log(`✅ Email sent successfully to ${to}`);
    console.log(`📋 Message ID: ${info.messageId}`);
    return info;
    
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    
    // Provide specific error guidance
    if (error.message.includes('timeout')) {
      console.error('💡 This is likely a network/firewall issue on the hosting platform');
    } else if (error.code === 'EAUTH') {
      console.error('💡 Authentication failed - check SMTP credentials');
    } else if (error.code === 'ECONNECTION') {
      console.error('💡 Connection failed - check SMTP host and port');
    }
    
    throw new Error(`Email delivery failed: ${error.message}`);
  }
}

// Test connection when module loads
testConnection();

export default transporter;
