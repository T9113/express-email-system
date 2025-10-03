import { sendMail } from './src/config/email.js';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  try {
    console.log('🧪 Testing email configuration...');
    console.log(`📧 SMTP Host: ${process.env.SMTP_HOST}`);
    console.log(`📧 From Email: ${process.env.FROM_EMAIL}`);
    console.log(`📧 From Name: ${process.env.FROM_NAME}`);
    
    const testEmail = 'tayyabmasood911@gmail.com';
    
    const result = await sendMail({
      to: testEmail,
      subject: 'Test Email from Express Email System',
      html: `
        <h2>🧪 Test Email</h2>
        <p>This is a test email from your Express Email System.</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p><strong>Brand:</strong> ${process.env.BRAND_NAME}</p>
        <p>If you receive this, your email configuration is working! ✅</p>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log(`📋 Message ID: ${result.messageId}`);
    console.log(`📤 Sent to: ${testEmail}`);
    
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error:', error.message);
    
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    
    // Common error messages
    if (error.message.includes('EAUTH')) {
      console.error('💡 Fix: Check your SMTP username and password');
    } else if (error.message.includes('ECONNECTION')) {
      console.error('💡 Fix: Check your SMTP host and port');
    } else if (error.message.includes('ETIMEOUT')) {
      console.error('💡 Fix: Check your internet connection and SMTP settings');
    }
  }
}

// Run the test
testEmail().then(() => {
  console.log('\n🏁 Email test completed');
  process.exit(0);
});