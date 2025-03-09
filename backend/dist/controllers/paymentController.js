"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerWebhookTest = exports.getPaymentStatus = exports.handleWebhook = exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config();
// Helper functions to get user address details
const getUserAddress = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        return (user === null || user === void 0 ? void 0 : user.address) || 'Default address';
    }
    catch (error) {
        console.error('Error fetching user address:', error);
        return 'Default address';
    }
});
const getUserCity = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        return (user === null || user === void 0 ? void 0 : user.city) || 'Default city';
    }
    catch (error) {
        console.error('Error fetching user city:', error);
        return 'Default city';
    }
});
const getUserPostalCode = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        return (user === null || user === void 0 ? void 0 : user.postalCode) || '12345';
    }
    catch (error) {
        console.error('Error fetching user postal code:', error);
        return '12345';
    }
});
const getUserCountry = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        return (user === null || user === void 0 ? void 0 : user.country) || 'US';
    }
    catch (error) {
        console.error('Error fetching user country:', error);
        return 'US';
    }
});
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartItems, userId } = req.body;
        if (!cartItems || cartItems.length === 0) {
            res.status(400).json({ message: 'No items in cart' });
            return;
        }
        const imagesJson = JSON.stringify(cartItems.map((item) => item.imageUrl));
        // Format line items for Stripe
        const lineItems = cartItems.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                    images: [item.imageUrl],
                },
                unit_amount: Math.round(item.price * 100), // Stripe requires amounts in cents
            },
            quantity: item.quantity,
        }));
        // Create checkout session
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            metadata: {
                userId: userId || 'guest',
                imagesJson: imagesJson,
            },
        });
        res.status(200).json({ id: session.id, url: session.url });
    }
    catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createCheckoutSession = createCheckoutSession;
const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    // For local development, we'll simulate the webhook event
    // In production, you'd validate the webhook signature from Stripe
    let event;
    if (process.env.NODE_ENV === 'production') {
        const sig = req.headers['stripe-signature'];
        try {
            if (!process.env.STRIPE_WEBHOOK_SECRET) {
                throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables');
            }
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            console.error(`Webhook Error: ${err.message}`);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
    }
    else {
        // For development, assume the request body is already the event
        // This allows us to test webhook functionality without Stripe signature validation
        try {
            event = req.body;
            console.log('Development mode: Skipping webhook signature verification');
        }
        catch (err) {
            console.error(`Webhook Error (Dev): ${err.message}`);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
    }
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            // Create order in database
            if (((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId) && session.metadata.userId !== 'guest') {
                try {
                    // Check if order already exists for this session
                    const existingOrder = yield Order_1.default.findOne({ 'paymentResult.id': session.id });
                    if (existingOrder) {
                        console.log('Order already exists for this session, skipping order creation:', existingOrder._id);
                        break;
                    }
                    // Get line items from the session
                    const lineItems = yield stripe.checkout.sessions.listLineItems(session.id);
                    let images = [];
                    try {
                        if ((_b = session.metadata) === null || _b === void 0 ? void 0 : _b.imagesJson) {
                            images = JSON.parse(session.metadata.imagesJson);
                            console.log('Parsed images:', images);
                        }
                    }
                    catch (err) {
                        console.error('Error parsing images metadata:', err);
                    }
                    // Create new order
                    yield Order_1.default.create({
                        user: session.metadata.userId,
                        orderItems: lineItems.data.map((item, index) => {
                            const imageUrl = (index < images.length) ? images[index] : '/images/default-image.png';
                            return {
                                name: item.description || 'Product',
                                quantity: item.quantity || 1,
                                price: (item.amount_total || 0) / 100, // Convert from cents to dollars
                                image: imageUrl,
                                product: '650e9b47ac76b6b95de0201c' // Placeholder product ID to satisfy validation
                            };
                        }),
                        shippingAddress: {
                            address: session.metadata.userId ? yield getUserAddress(session.metadata.userId) : 'Default address',
                            city: session.metadata.userId ? yield getUserCity(session.metadata.userId) : 'Default city',
                            postalCode: session.metadata.userId ? yield getUserPostalCode(session.metadata.userId) : '12345',
                            country: session.metadata.userId ? yield getUserCountry(session.metadata.userId) : 'US',
                        },
                        paymentMethod: 'Stripe',
                        paymentResult: {
                            id: session.id,
                            status: session.payment_status,
                            update_time: new Date().toISOString(),
                            email_address: ((_c = session.customer_details) === null || _c === void 0 ? void 0 : _c.email) || '',
                        },
                        taxPrice: (((_d = session.total_details) === null || _d === void 0 ? void 0 : _d.amount_tax) || 0) / 100,
                        shippingPrice: 0,
                        totalPrice: session.amount_total ? session.amount_total / 100 : 0,
                        isPaid: true,
                        paidAt: new Date(),
                        isDelivered: false,
                    });
                }
                catch (error) {
                    console.error('Error creating order:', error);
                }
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
});
exports.handleWebhook = handleWebhook;
const getPaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { sessionId } = req.params;
        const session = yield stripe.checkout.sessions.retrieve(sessionId);
        // If payment is successful and we're in development, simulate the webhook
        if (process.env.NODE_ENV !== 'production' && session.payment_status === 'paid') {
            try {
                console.log('Development mode: Simulating webhook for completed checkout');
                console.log('Session data:', session);
                // Check if order already exists for this session
                const existingOrder = yield Order_1.default.findOne({ 'paymentResult.id': session.id });
                if (existingOrder) {
                    console.log('Order already exists for this session, skipping order creation:', existingOrder._id);
                    res.status(200).json({
                        success: true,
                        session,
                        order: existingOrder,
                        message: 'Order already exists'
                    });
                    return;
                }
                // Simulate webhook by making a request to our own webhook endpoint
                const webhookData = {
                    type: 'checkout.session.completed',
                    data: {
                        object: session
                    }
                };
                // We're calling our own webhook endpoint - no need for separate HTTP request
                // Instead, we'll just process the same logic directly
                const lineItems = yield stripe.checkout.sessions.listLineItems(session.id);
                console.log('Line items retrieved:', lineItems.data);
                if (((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId) && session.metadata.userId !== 'guest') {
                    console.log('Creating order for user:', session.metadata.userId);
                    let images = [];
                    try {
                        if ((_b = session.metadata) === null || _b === void 0 ? void 0 : _b.imagesJson) {
                            images = JSON.parse(session.metadata.imagesJson);
                            console.log('Parsed images:', images);
                        }
                    }
                    catch (err) {
                        console.error('Error parsing images metadata:', err);
                    }
                    const newOrder = yield Order_1.default.create({
                        user: session.metadata.userId,
                        orderItems: lineItems.data.map((item, index) => {
                            const imageUrl = (index < images.length) ? images[index] : '/images/default-image.png';
                            return {
                                name: item.description || 'Product',
                                quantity: item.quantity || 1,
                                price: (item.amount_total || 0) / 100, // Convert from cents to dollars
                                image: imageUrl,
                                product: '650e9b47ac76b6b95de0201c' // Placeholder product ID to satisfy validation
                            };
                        }),
                        shippingAddress: {
                            address: session.metadata.userId ? yield getUserAddress(session.metadata.userId) : 'Default address',
                            city: session.metadata.userId ? yield getUserCity(session.metadata.userId) : 'Default city',
                            postalCode: session.metadata.userId ? yield getUserPostalCode(session.metadata.userId) : '12345',
                            country: session.metadata.userId ? yield getUserCountry(session.metadata.userId) : 'US',
                        },
                        paymentMethod: 'Stripe',
                        paymentResult: {
                            id: session.id,
                            status: session.payment_status,
                            update_time: new Date().toISOString(),
                            email_address: ((_c = session.customer_details) === null || _c === void 0 ? void 0 : _c.email) || '',
                        },
                        taxPrice: (((_d = session.total_details) === null || _d === void 0 ? void 0 : _d.amount_tax) || 0) / 100,
                        shippingPrice: 0,
                        totalPrice: session.amount_total ? session.amount_total / 100 : 0,
                        isPaid: true,
                        paidAt: new Date(),
                        isDelivered: false,
                        status: 'pending',
                    });
                    console.log('Development mode: Order created for checkout session', newOrder);
                }
                else {
                    console.log('No valid user ID in metadata:', session.metadata);
                }
            }
            catch (webhookErr) {
                console.error('Error simulating webhook:', webhookErr);
            }
        }
        res.status(200).json({
            success: session.payment_status === 'paid',
            session,
        });
    }
    catch (error) {
        console.error('Error retrieving payment status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getPaymentStatus = getPaymentStatus;
// Development route to manually trigger a webhook (only available in development)
const triggerWebhookTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (process.env.NODE_ENV === 'production') {
        res.status(403).json({ message: 'This endpoint is only available in development mode' });
        return;
    }
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            res.status(400).json({ message: 'Session ID is required' });
            return;
        }
        const session = yield stripe.checkout.sessions.retrieve(sessionId);
        // Create a mock webhook event
        const event = {
            type: 'checkout.session.completed',
            data: {
                object: session
            }
        };
        // Process the same logic as in the webhook handler
        const lineItems = yield stripe.checkout.sessions.listLineItems(session.id);
        if (((_a = session.metadata) === null || _a === void 0 ? void 0 : _a.userId) && session.metadata.userId !== 'guest') {
            // Check if order already exists for this session
            const existingOrder = yield Order_1.default.findOne({ 'paymentResult.id': session.id });
            if (existingOrder) {
                console.log('Order already exists for this session, skipping order creation:', existingOrder._id);
                res.status(200).json({
                    success: true,
                    message: 'Order already exists for this session',
                    order: existingOrder
                });
                return;
            }
            let images = [];
            try {
                if ((_b = session.metadata) === null || _b === void 0 ? void 0 : _b.imagesJson) {
                    images = JSON.parse(session.metadata.imagesJson);
                    console.log('Parsed images:', images);
                }
            }
            catch (err) {
                console.error('Error parsing images metadata:', err);
            }
            const newOrder = yield Order_1.default.create({
                user: session.metadata.userId,
                orderItems: lineItems.data.map((item, index) => {
                    const imageUrl = (index < images.length) ? images[index] : '/images/default-image.png';
                    return {
                        name: item.description || 'Product',
                        quantity: item.quantity || 1,
                        price: (item.amount_total || 0) / 100, // Convert from cents to dollars
                        image: imageUrl,
                        product: '650e9b47ac76b6b95de0201c' // Placeholder product ID to satisfy validation
                    };
                }),
                shippingAddress: {
                    address: session.metadata.userId ? yield getUserAddress(session.metadata.userId) : 'Default address',
                    city: session.metadata.userId ? yield getUserCity(session.metadata.userId) : 'Default city',
                    postalCode: session.metadata.userId ? yield getUserPostalCode(session.metadata.userId) : '12345',
                    country: session.metadata.userId ? yield getUserCountry(session.metadata.userId) : 'US',
                },
                paymentMethod: 'Stripe',
                paymentResult: {
                    id: session.id,
                    status: session.payment_status,
                    update_time: new Date().toISOString(),
                    email_address: ((_c = session.customer_details) === null || _c === void 0 ? void 0 : _c.email) || '',
                },
                taxPrice: (((_d = session.total_details) === null || _d === void 0 ? void 0 : _d.amount_tax) || 0) / 100,
                shippingPrice: 0,
                totalPrice: session.amount_total ? session.amount_total / 100 : 0,
                isPaid: true,
                paidAt: new Date(),
                isDelivered: false,
                status: 'pending',
            });
            console.log('Test webhook: Order created', newOrder);
            res.status(200).json({
                success: true,
                message: 'Test webhook processed successfully and order created'
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: 'Session does not have valid user ID in metadata'
            });
        }
    }
    catch (error) {
        console.error('Error triggering test webhook:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.triggerWebhookTest = triggerWebhookTest;
