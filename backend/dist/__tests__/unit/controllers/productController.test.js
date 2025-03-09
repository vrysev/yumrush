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
const productController_1 = require("../../../controllers/productController");
const Product_1 = __importDefault(require("../../../models/Product"));
// Mock the Product model
jest.mock('../../../models/Product', () => ({
    find: jest.fn(),
    findById: jest.fn(),
}));
describe('Product Controller', () => {
    let req;
    let res;
    let mockJson;
    let mockStatus;
    beforeEach(() => {
        mockJson = jest.fn().mockReturnThis();
        mockStatus = jest.fn().mockReturnThis();
        res = {
            json: mockJson,
            status: mockStatus,
        };
        req = {
            params: {},
            query: {},
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getProducts', () => {
        it('should return all products with no filters', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockProducts = [
                { _id: '1', title: 'Pizza', price: 15.99 },
                { _id: '2', title: 'Burger', price: 10.99 },
            ];
            Product_1.default.find.mockImplementation(() => ({
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockProducts),
            }));
            yield (0, productController_1.getProducts)(req, res);
            expect(Product_1.default.find).toHaveBeenCalled();
            expect(mockJson).toHaveBeenCalledWith(mockProducts);
        }));
        it('should filter products by category', () => __awaiter(void 0, void 0, void 0, function* () {
            req.query = { category: '1' };
            const mockProducts = [{ _id: '1', title: 'Pizza', price: 15.99, category: 1 }];
            Product_1.default.find.mockImplementation(() => ({
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockProducts),
            }));
            yield (0, productController_1.getProducts)(req, res);
            expect(Product_1.default.find).toHaveBeenCalledWith(expect.objectContaining({ category: 1 }));
            expect(mockJson).toHaveBeenCalledWith(mockProducts);
        }));
    });
    describe('getProductById', () => {
        it('should return a product if it exists', () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: '1' };
            const mockProduct = { _id: '1', title: 'Pizza', price: 15.99 };
            Product_1.default.findById.mockResolvedValue(mockProduct);
            yield (0, productController_1.getProductById)(req, res);
            expect(Product_1.default.findById).toHaveBeenCalledWith('1');
            expect(mockJson).toHaveBeenCalledWith(mockProduct);
        }));
        it('should return 404 if product does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            req.params = { id: 'nonexistent' };
            Product_1.default.findById.mockResolvedValue(null);
            yield (0, productController_1.getProductById)(req, res);
            expect(Product_1.default.findById).toHaveBeenCalledWith('nonexistent');
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Product not found' });
        }));
    });
});
