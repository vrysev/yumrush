import { Request, Response } from 'express';
import { getProducts, getProductById } from '../../../controllers/productController';
import Product from '../../../models/Product';

// Mock the Product model
jest.mock('../../../models/Product', () => ({
  find: jest.fn(),
  findById: jest.fn(),
}));

describe('Product Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

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
    it('should return all products with no filters', async () => {
      const mockProducts = [
        { _id: '1', title: 'Pizza', price: 15.99 },
        { _id: '2', title: 'Burger', price: 10.99 },
      ];

      // Mock the select method to directly return the mock products
      (Product.find as jest.Mock).mockReturnThis();
      (Product as any).select = jest.fn().mockReturnValue(mockProducts);

      await getProducts(req as Request, res as Response);

      expect(Product.find).toHaveBeenCalled();
      expect(mockJson).toHaveBeenCalledWith(mockProducts);
    });

    it('should filter products by category', async () => {
      req.query = { category: '1' };
      const mockProducts = [{ _id: '1', title: 'Pizza', price: 15.99, category: 1 }];

      // Mock the select method to directly return the mock products
      (Product.find as jest.Mock).mockReturnThis();
      (Product as any).select = jest.fn().mockReturnValue(mockProducts);

      await getProducts(req as Request, res as Response);

      expect(Product.find).toHaveBeenCalledWith(expect.objectContaining({ category: 1 }));
      expect(mockJson).toHaveBeenCalledWith(mockProducts);
    });
  });

  describe('getProductById', () => {
    it('should return a product if it exists', async () => {
      req.params = { id: '1' };
      const mockProduct = { _id: '1', title: 'Pizza', price: 15.99 };

      (Product.findById as jest.Mock).mockResolvedValue(mockProduct);

      await getProductById(req as Request, res as Response);

      expect(Product.findById).toHaveBeenCalledWith('1');
      expect(mockJson).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 404 if product does not exist', async () => {
      req.params = { id: 'nonexistent' };

      (Product.findById as jest.Mock).mockResolvedValue(null);

      await getProductById(req as Request, res as Response);

      expect(Product.findById).toHaveBeenCalledWith('nonexistent');
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Product not found' });
    });
  });
});