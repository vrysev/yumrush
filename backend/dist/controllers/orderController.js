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
exports.updateOrderToDelivered = exports.updateOrderStatus = exports.getOrders = exports.getMyOrders = exports.getOrderById = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
// @desc    Create a new order directly (not via Stripe)
// @route   POST /api/orders
// @access  Private
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice, } = req.body;
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        if (!orderItems || orderItems.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        }
        const order = yield Order_1.default.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
        });
        res.status(201).json(order);
    }
    catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createOrder = createOrder;
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order_1.default.findById(req.params.id).populate('user', '_id name email');
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        // Check if the user is the owner of the order or an admin
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const user = yield User_1.default.findById(req.user._id);
        if (order.user.toString() !== req.user._id.toString() && !(user === null || user === void 0 ? void 0 : user.isAdmin)) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        res.status(200).json(order);
    }
    catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getOrderById = getOrderById;
// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const orders = yield Order_1.default.find({ user: req.user._id });
        res.status(200).json(orders);
    }
    catch (error) {
        console.error('Get my orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getMyOrders = getMyOrders;
// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const user = yield User_1.default.findById(req.user._id);
        if (!(user === null || user === void 0 ? void 0 : user.isAdmin)) {
            res.status(401).json({ message: 'Not authorized as admin' });
            return;
        }
        const orders = yield Order_1.default.find({}).populate('user', '_id name email');
        res.status(200).json(orders);
    }
    catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getOrders = getOrders;
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const user = yield User_1.default.findById(req.user._id);
        if (!(user === null || user === void 0 ? void 0 : user.isAdmin)) {
            res.status(401).json({ message: 'Not authorized as admin' });
            return;
        }
        const order = yield Order_1.default.findById(req.params.id);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        order.status = status;
        if (status === 'delivered') {
            order.isDelivered = true;
            order.deliveredAt = new Date();
        }
        const updatedOrder = yield order.save();
        res.status(200).json(updatedOrder);
    }
    catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// @desc    Mark order as delivered
// @route   PUT /api/orders/:id/deliver
// @access  Admin
const updateOrderToDelivered = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const user = yield User_1.default.findById(req.user._id);
        if (!(user === null || user === void 0 ? void 0 : user.isAdmin)) {
            res.status(401).json({ message: 'Not authorized as admin' });
            return;
        }
        const order = yield Order_1.default.findById(req.params.id);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        order.isDelivered = true;
        order.deliveredAt = new Date();
        order.status = 'delivered';
        const updatedOrder = yield order.save();
        res.status(200).json(updatedOrder);
    }
    catch (error) {
        console.error('Update order to delivered error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateOrderToDelivered = updateOrderToDelivered;
