import express from 'express';
import mongoose from 'mongoose';
import { getMetrics } from '../middleware/monitoringMiddleware';
import { logger } from '../utils/logger';

const router = express.Router();

// Basic health check endpoint
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Detailed health check with system metrics
router.get('/details', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Get system metrics
    const metrics = getMetrics();
    
    // Get process metrics
    const processMetrics = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    };
    
    // Get environment info
    const environmentInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      env: process.env.NODE_ENV,
    };
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        name: mongoose.connection.name,
      },
      api: metrics,
      process: processMetrics,
      environment: environmentInfo,
    });
  } catch (error: any) {
    logger.error('Health check failed', { error: error.message });
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving health information',
    });
  }
});

export default router;