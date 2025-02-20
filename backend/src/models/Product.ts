// src/models/Product.ts
import mongoose from 'mongoose';
import { IProduct } from '../types/product';

const ProductSchema = new mongoose.Schema({
  productId: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: Number, 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true 
  },
  preparationTime: { 
    type: String, 
    required: true 
  }
});

export default mongoose.model<IProduct>('Product', ProductSchema);
