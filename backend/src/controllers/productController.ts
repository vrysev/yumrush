import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, sortBy, search } = req.query;
    
    let query: any = {};
    
    if (category) {
      query.category = Number(category);
    }
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    let products = await Product.find(query).select('-__v -createdAt -updatedAt');
    
    if (sortBy) {
      switch (sortBy) {
        case 'price':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'title':
          products.sort((a, b) => a.title.localeCompare(b.title));
          break;
      }
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
