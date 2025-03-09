"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Webhook route (no protection needed, Stripe calls it)
// Note: Express middleware for this endpoint is configured in app.ts
router.post('/webhook', paymentController_1.handleWebhook);
// Create checkout session
router.post('/create-checkout-session', authMiddleware_1.protect, paymentController_1.createCheckoutSession);
// Get payment status
router.get('/status/:sessionId', authMiddleware_1.protect, paymentController_1.getPaymentStatus);
// Development routes (only available in non-production environments)
if (process.env.NODE_ENV !== 'production') {
    // Test webhook manually
    router.post('/test-webhook', authMiddleware_1.protect, paymentController_1.triggerWebhookTest);
}
exports.default = router;
