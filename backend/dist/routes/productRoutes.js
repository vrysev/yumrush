"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public routes
router.get('/', productController_1.getProducts);
router.get('/:id', productController_1.getProductById);
// Admin routes
router.post('/', authMiddleware_1.protect, authMiddleware_1.admin, productController_1.createProduct);
router.put('/:id', authMiddleware_1.protect, authMiddleware_1.admin, productController_1.updateProduct);
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, productController_1.deleteProduct);
exports.default = router;
