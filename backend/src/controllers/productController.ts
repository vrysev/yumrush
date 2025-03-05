import { Request, Response } from 'express';
import Product from '../models/Product';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, sortBy, search } = req.query;
    
    let query: any = {};
    
    // Apply category filter only if it's provided and we're not doing a global search
    if (category && (!search || search === '')) {
      query.category = Number(category);
    }
    
    // Apply search filter if provided - search in title and make it case insensitive
    if (search && search !== '') {
      query.title = { $regex: search, $options: 'i' };
    }

    let products = await Product.find(query).select('-__v');
    
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

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      productId,
      title,
      price,
      imageUrl,
      category,
      rating,
      preparationTime,
      description
    } = req.body;

    const productExists = await Product.findOne({ productId });

    if (productExists) {
      res.status(400).json({ message: 'Product with this ID already exists' });
      return;
    }

    const product = await Product.create({
      productId,
      title,
      price,
      imageUrl,
      category,
      rating,
      preparationTime,
      description
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      price,
      imageUrl,
      category,
      rating,
      preparationTime,
      description
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = title || product.title;
      product.price = price || product.price;
      product.imageUrl = imageUrl || product.imageUrl;
      product.category = category !== undefined ? category : product.category;
      product.rating = rating || product.rating;
      product.preparationTime = preparationTime || product.preparationTime;
      product.description = description || product.description

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
