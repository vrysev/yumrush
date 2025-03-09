import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import productRoutes from '../../routes/productRoutes';
import Product from '../../models/Product';

// Create a minimal express app for testing
const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

describe('Product Routes', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/yumrush_test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Disconnect after tests
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Seed test data
    await Product.deleteMany({});
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
    await Product.insertMany(testProducts);
  });

  afterEach(async () => {
    // Clean up after each test
    await Product.deleteMany({});
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app).get('/api/products');
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('title', 'Margherita Pizza');
      expect(response.body[1]).toHaveProperty('title', 'Classic Burger');
    });

    it('should filter by category', async () => {
      const response = await request(app).get('/api/products?category=1');
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('title', 'Margherita Pizza');
    });

    it('should search by title', async () => {
      const response = await request(app).get('/api/products?search=pizza');
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('title', 'Margherita Pizza');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a product by id', async () => {
      // First get all products to find an ID
      const allProducts = await request(app).get('/api/products');
      const productId = allProducts.body[0]._id;
      
      // Then get a specific product
      const response = await request(app).get(`/api/products/${productId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Margherita Pizza');
    });

    it('should return 404 for non-existent product', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/products/${nonExistentId}`);
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Product not found');
    });
  });
});