"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public routes
router.post('/', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.post('/create-admin', userController_1.createAdminUser);
// Protected routes
router.route('/profile')
    .get(authMiddleware_1.protect, userController_1.getUserProfile)
    .put(authMiddleware_1.protect, userController_1.updateUserProfile);
// Admin routes (protection is checked in the controllers)
router.route('/')
    .get(authMiddleware_1.protect, userController_1.getUsers);
// User management routes (admin only)
router.route('/:id')
    .get(authMiddleware_1.protect, userController_1.getUserById)
    .put(authMiddleware_1.protect, userController_1.updateUserById)
    .patch(authMiddleware_1.protect, userController_1.updateUserAdminStatus);
exports.default = router;
