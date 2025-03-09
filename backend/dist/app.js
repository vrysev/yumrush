"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const monitoringMiddleware_1 = require("./middleware/monitoringMiddleware");
const logger_1 = require("./utils/logger");
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect to database
(0, db_1.default)();
// Middleware
app.use((0, cors_1.default)());
// Monitoring and logging middleware
app.use((0, morgan_1.default)('combined', { stream: logger_1.stream }));
app.use(monitoringMiddleware_1.monitoringMiddleware);
// Special middleware for Stripe webhook to get raw body
// In production, use raw parser for webhook validation
if (process.env.NODE_ENV === 'production') {
    app.use('/api/payments/webhook', express_1.default.raw({ type: 'application/json' }));
}
else {
    // In development, we can use the regular JSON parser since we're skipping signature validation
    app.use('/api/payments/webhook', express_1.default.json());
}
// Regular middleware for all other routes
app.use(express_1.default.json());
// Routes
app.use('/api/products', productRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/health', healthRoutes_1.default);
app.use('/images', express_1.default.static(path_1.default.join(__dirname, 'public/images')));
// Ensure environment variables are loaded
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLIC_KEY) {
    console.error('Error: Stripe API keys are missing. Please check your .env file.');
    process.exit(1);
}
const PORT = process.env.PORT || 1972;
app.listen(PORT, () => {
    logger_1.logger.info(`Server running on port ${PORT}`, { environment: process.env.NODE_ENV });
});
