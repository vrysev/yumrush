"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public routes
// None
// Protected routes
router.route('/')
    .post(authMiddleware_1.protect, orderController_1.createOrder)
    .get(authMiddleware_1.protect, orderController_1.getOrders); // Admin only, checked in controller
router.route('/myorders')
    .get(authMiddleware_1.protect, orderController_1.getMyOrders);
router.route('/:id')
    .get(authMiddleware_1.protect, orderController_1.getOrderById);
router.route('/:id/status')
    .put(authMiddleware_1.protect, orderController_1.updateOrderStatus); // Admin only, checked in controller
router.route('/:id/deliver')
    .put(authMiddleware_1.protect, orderController_1.updateOrderToDelivered); // Admin only, checked in controller
exports.default = router;
