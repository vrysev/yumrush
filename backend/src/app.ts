import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import path from 'path';

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.use('/images', express.static(path.join(__dirname, 'public/images')));

const PORT = process.env.PORT || 1972;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
