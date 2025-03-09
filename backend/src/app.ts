import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import healthRoutes from './routes/healthRoutes';
import { monitoringMiddleware } from './middleware/monitoringMiddleware';
import { logger, stream } from './utils/logger';
import morgan from 'morgan';
import path from 'path';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());

// Monitoring and logging middleware
app.use(morgan('combined', { stream }));
app.use(monitoringMiddleware);

// Special middleware for Stripe webhook to get raw body
// In production, use raw parser for webhook validation
if (process.env.NODE_ENV === 'production') {
  app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
} else {
  // In development, we can use the regular JSON parser since we're skipping signature validation
  app.use('/api/payments/webhook', express.json());
}

// Regular middleware for all other routes
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/health', healthRoutes);

app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Ensure environment variables are loaded
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLIC_KEY) {
  console.error('Error: Stripe API keys are missing. Please check your .env file.');
  process.exit(1);
}

const PORT = process.env.PORT || 1972;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { environment: process.env.NODE_ENV });
});
