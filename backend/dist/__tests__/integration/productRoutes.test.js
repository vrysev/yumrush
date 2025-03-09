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
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const productRoutes_1 = __importDefault(require("../../routes/productRoutes"));
const Product_1 = __importDefault(require("../../models/Product"));
// Create a minimal express app for testing
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/products', productRoutes_1.default);
describe('Product Routes', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Connect to test database
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/yumrush_test';
        yield mongoose_1.default.connect(mongoUri);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Disconnect after tests
        yield mongoose_1.default.connection.close();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Seed test data
        yield Product_1.default.deleteMany({});
        const testProducts = [
            {
                productId: 1,
                title: 'Margherita Pizza',
                price: 12.99,
                imageUrl: 'http://localhost:1972/images/pizzas/margherita.png',
                category: 1,
                rating: 4.5,
                preparationTime: '25 min',
            },
            {
                productId: 2,
                title: 'Classic Burger',
                price: 9.99,
                imageUrl: 'http://localhost:1972/images/burgers/classic-burger.png',
                category: 2,
                rating: 4.2,
                preparationTime: '20 min',
            },
        ];
        yield Product_1.default.insertMany(testProducts);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up after each test
        yield Product_1.default.deleteMany({});
    }));
    describe('GET /api/products', () => {
        it('should return all products', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get('/api/products');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body[0]).toHaveProperty('title', 'Margherita Pizza');
            expect(response.body[1]).toHaveProperty('title', 'Classic Burger');
        }));
        it('should filter by category', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get('/api/products?category=1');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty('title', 'Margherita Pizza');
        }));
        it('should search by title', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get('/api/products?search=pizza');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty('title', 'Margherita Pizza');
        }));
    });
    describe('GET /api/products/:id', () => {
        it('should return a product by id', () => __awaiter(void 0, void 0, void 0, function* () {
            // First get all products to find an ID
            const allProducts = yield (0, supertest_1.default)(app).get('/api/products');
            const productId = allProducts.body[0]._id;
            // Then get a specific product
            const response = yield (0, supertest_1.default)(app).get(`/api/products/${productId}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('title', 'Margherita Pizza');
        }));
        it('should return 404 for non-existent product', () => __awaiter(void 0, void 0, void 0, function* () {
            const nonExistentId = new mongoose_1.default.Types.ObjectId();
            const response = yield (0, supertest_1.default)(app).get(`/api/products/${nonExistentId}`);
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Product not found');
        }));
    });
});
