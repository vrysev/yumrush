import express from 'express';
import { 
  createCheckoutSession, 
  handleWebhook, 
  getPaymentStatus,
  triggerWebhookTest
} from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Webhook route (no protection needed, Stripe calls it)
// Note: Express middleware for this endpoint is configured in app.ts
router.post('/webhook', handleWebhook);

// Create checkout session
router.post('/create-checkout-session', protect, createCheckoutSession);

// Get payment status
router.get('/status/:sessionId', protect, getPaymentStatus);

// Development routes (only available in non-production environments)
if (process.env.NODE_ENV !== 'production') {
  // Test webhook manually
  router.post('/test-webhook', protect, triggerWebhookTest);
}

export default router;