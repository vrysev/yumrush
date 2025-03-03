import mongoose from 'mongoose';
import Product from '../models/Product';
import User from '../models/User';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Get the base URL from environment or default to localhost
const BASE_URL = process.env.BACKEND_URL || 'http://localhost:1972/images';

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

const initDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
    
    // Initialize Products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    
    console.log('Inserting new products...');
    const productResult = await Product.insertMany(initialProducts);
    console.log(`Inserted ${productResult.length} products`);
    
    // Initialize Admin User (only if no users exist)
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Creating admin user...');
      await User.create(initialAdmin);
      console.log('Admin user created');
    } else {
      console.log('Users already exist, skipping admin creation');
    }
    
    console.log('Database initialized successfully!');
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};
  
initDB();
