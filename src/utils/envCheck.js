// Simple deployment verification script
const requiredEnvVars = [
  'JWT_SECRET',
  'SMTP_HOST',
  'SMTP_USER', 
  'SMTP_PASS',
  'FROM_EMAIL',
  'BRAND_NAME'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  process.exit(1);
}

console.log('✅ All required environment variables are set');
console.log('🔧 Environment check passed');

// Export for use in main app
export { requiredEnvVars };