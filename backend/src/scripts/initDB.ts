import mongoose from 'mongoose';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:5000/images';

const initialProducts = [
 // Pizzas
 {
    productId: 7,
    imageUrl: `${BASE_URL}/pizzas/margherita.png`,
    title: "Margherita",
    price: 4.5,
    category: 0, // Pizza category
    rating: 10,
    preparationTime: "14-20 minutes"
  },
  {
    productId: 8,
    imageUrl: `${BASE_URL}/pizzas/four-seasons.png`,
    title: "Four Seasons",
    price: 3.95,
    category: 0, 
    rating: 10,
    preparationTime: "14-20 minutes"
  },
  // Burgers
  {
    productId: 9,
    imageUrl: `${BASE_URL}/burgers/classic-burger.png`,
    title: "Classic Burger",
    price: 3.99,
    category: 1, 
    rating: 9,
    preparationTime: "10-15 minutes"
  },
  {
    productId: 10,
    imageUrl: `${BASE_URL}/burgers/classic-burger.png`,
    title: "Cheese Burger",
    price: 4.50,
    category: 1,
    rating: 8,
    preparationTime: "10-15 minutes"
  },
  // Fries
  {
    productId: 11,
    imageUrl: `${BASE_URL}/fries/classic-fries.png`,
    title: "Classic Fries",
    price: 2.50,
    category: 2, 
    rating: 8,
    preparationTime: "8-12 minutes"
  },
  {
    productId: 12,
    imageUrl: `${BASE_URL}/fries/classic-fries.png`,
    title: "Sweet Potato Fries",
    price: 3.00,
    category: 2,
    rating: 9,
    preparationTime: "8-12 minutes"
  },
  // Packs/Combos
  {
    productId: 13,
    imageUrl: `${BASE_URL}/packs/family-pack.jpg`,
    title: "Family Pack",
    price: 15.99,
    category: 3, 
    rating: 10,
    preparationTime: "20-25 minutes"
  },
  {
    productId: 14,
    imageUrl: `${BASE_URL}/packs/burger-combo.jpg`,
    title: "Burger Combo",
    price: 8.99,
    category: 3,
    rating: 9,
    preparationTime: "15-20 minutes"
  }
];

const initDB = async () => {
    try {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yumrush';
      
      console.log('Connecting to MongoDB...');
      await mongoose.connect(mongoURI);
      console.log('Connected to MongoDB');
      
      console.log('Clearing existing products...');
      await Product.deleteMany({});
      
      console.log('Inserting new products...');
      const result = await Product.insertMany(initialProducts);
      console.log(`Inserted ${result.length} products`);
      
      console.log('Database initialized successfully!');
      await mongoose.connection.close();
    } catch (error) {
      console.error('Error initializing database:', error);
      process.exit(1);
    }
  };
  
  initDB();
