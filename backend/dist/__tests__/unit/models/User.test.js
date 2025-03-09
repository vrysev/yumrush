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
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../../../models/User"));
describe('User Model', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Connect to test database
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/yumrush_test';
        yield mongoose_1.default.connect(mongoUri);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Disconnect after tests
        yield mongoose_1.default.connection.close();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up after each test
        yield User_1.default.deleteMany({});
    }));
    it('should hash the password before saving', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create a user with a plain text password
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            isAdmin: false,
        };
        const user = new User_1.default(userData);
        yield user.save();
        // Retrieve the user from DB
        const savedUser = yield User_1.default.findOne({ email: 'test@example.com' });
        // Password should be hashed and not match the original
        expect(savedUser === null || savedUser === void 0 ? void 0 : savedUser.password).not.toBe('password123');
        // Using the matchPassword method should return true for the original password
        const isMatch = yield (savedUser === null || savedUser === void 0 ? void 0 : savedUser.matchPassword('password123'));
        expect(isMatch).toBe(true);
    }));
    it('should validate a user with required fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = new User_1.default({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        });
        const savedUser = yield user.save();
        expect(savedUser.name).toBe('Test User');
        expect(savedUser.email).toBe('test@example.com');
        expect(savedUser.isAdmin).toBe(false); // Default value
    }));
    it('should not validate a user without required fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const userWithoutName = new User_1.default({
            email: 'test@example.com',
            password: 'password123',
        });
        yield expect(userWithoutName.save()).rejects.toThrow();
    }));
});
