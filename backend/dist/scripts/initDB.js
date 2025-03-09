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
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Get the base URL from environment or default to localhost
const BASE_URL = process.env.BACKEND_URL;
const initialProducts = [
    // Pizzas
    {
        productId: 1,
        imageUrl: `${BASE_URL}/pizzas/margherita.png`,
        title: "Margherita",
        price: 4.5,
        category: 0, // Pizza category
        rating: 10,
        preparationTime: "14-20 minutes"
    },
    {
        productId: 2,
        imageUrl: `${BASE_URL}/pizzas/four-seasons.png`,
        title: "Four Seasons",
        price: 3.95,
        category: 0,
        rating: 10,
        preparationTime: "14-20 minutes"
    },
    // Burgers
    {
        productId: 3,
        imageUrl: `${BASE_URL}/burgers/classic-burger.png`,
        title: "Classic Burger",
        price: 3.99,
        category: 1,
        rating: 9,
        preparationTime: "10-15 minutes"
    },
    {
        productId: 4,
        imageUrl: `${BASE_URL}/burgers/classic-burger.png`,
        title: "Cheese Burger",
        price: 4.50,
        category: 1,
        rating: 8,
        preparationTime: "10-15 minutes"
    },
    // Fries
    {
        productId: 5,
        imageUrl: `${BASE_URL}/fries/classic-fries.png`,
        title: "Classic Fries",
        price: 2.50,
        category: 2,
        rating: 8,
        preparationTime: "8-12 minutes"
    },
    {
        productId: 6,
        imageUrl: `${BASE_URL}/fries/sweet-potato-fries.png`,
        title: "Sweet Potato Fries",
        price: 3.00,
        category: 2,
        rating: 9,
        preparationTime: "8-12 minutes"
    }
];
// Initial admin user
const initialAdmin = {
    name: 'Admin User',
    email: 'admin@yumrush.com',
    password: 'admin123',
    isAdmin: true
};
const initDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        console.log('Connecting to MongoDB Atlas...');
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');
        // Initialize Products
        console.log('Clearing existing products...');
        yield Product_1.default.deleteMany({});
        console.log('Inserting new products...');
        const productResult = yield Product_1.default.insertMany(initialProducts);
        console.log(`Inserted ${productResult.length} products`);
        // Initialize Admin User (only if no users exist)
        const userCount = yield User_1.default.countDocuments();
        if (userCount === 0) {
            console.log('Creating admin user...');
            yield User_1.default.create(initialAdmin);
            console.log('Admin user created');
        }
        else {
            console.log('Users already exist, skipping admin creation');
        }
        console.log('Database initialized successfully!');
        yield mongoose_1.default.connection.close();
        console.log('Database connection closed');
    }
    catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
});
initDB();
