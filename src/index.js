import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';
import rootRoutes from './routes/root.js';
import { generalRateLimit } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/validation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security middleware
app.use(helmet());
app.use(cors());
app.use(generalRateLimit);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Static files - serve test interface
app.use('/test', express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/', rootRoutes);
app.use('/api/v1', apiRoutes);
app.use('/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => res.json({ 
  ok: true, 
  status: 'healthy',
  service: 'Express Email System',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development',
  uptime: process.uptime(),
  memory: process.memoryUsage(),
  smtp: {
    configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
    host: process.env.SMTP_HOST || 'not configured'
  },
  brand: process.env.BRAND_NAME || 'Default'
}));

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email system ready with ${process.env.BRAND_NAME || 'Default'} branding`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: ${process.env.APP_URL || `http://localhost:${PORT}`}`);
  console.log(`📖 Documentation: ${process.env.APP_URL || `http://localhost:${PORT}`}/api/v1/docs`);
  console.log(`🧪 Test Interface: ${process.env.APP_URL || `http://localhost:${PORT}`}/test`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});
