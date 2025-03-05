import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import '../Admin.scss';

interface Product {
  _id: string;
  productId: number;
  imageUrl: string;
  title: string;
  price: number;
  category: number;
  rating: number;
  preparationTime: string;
}

const AdminProducts: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: 0,
    title: '',
    price: 0,
    category: 1,
    preparationTime: '',
    imageUrl: '',
    rating: 5,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1972';
        const response = await fetch(`${apiUrl}/api/products`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Products fetched successfully:', data);
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1972';
      const response = await fetch(`${apiUrl}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to delete product: ${errorData.message || response.statusText}`);
      }
      
      // Update local state
      setProducts(products.filter((p) => p._id !== productId));
      alert('Product deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting product:', err);
      alert(`Failed to delete product: ${err.message}`);
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      productId: product.productId,
      title: product.title,
      price: product.price,
      category: product.category,
      preparationTime: product.preparationTime,
      imageUrl: product.imageUrl,
      rating: product.rating,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAddNewProduct = () => {
    setSelectedProduct(null);
    setFormData({
      productId: Math.floor(1000 + Math.random() * 9000), // Generate a random product ID
      title: '',
      price: 0,
      category: 1,
      preparationTime: '15-20 min',
      imageUrl: '',
      rating: 5,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue = value;
    if (type === 'number' && value !== '') {
      parsedValue = parseFloat(value);
    }
    
    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let response;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1972';
      
      if (isEditing && selectedProduct) {
        // Update existing product
        response = await fetch(`${apiUrl}/api/products/${selectedProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new product
        console.log('Creating product with data:', formData);
        response = await fetch(`${apiUrl}/api/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(formData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API response error:', errorData);
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} product: ${errorData.message || response.statusText}`);
      }
      
      const updatedProduct = await response.json();
      console.log(`Product ${isEditing ? 'updated' : 'created'} successfully:`, updatedProduct);
      
      // Update local state
      if (isEditing) {
        setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
      } else {
        setProducts([...products, updatedProduct]);
      }
      
      // Close modal
      setIsModalOpen(false);
      
      // Show success message
      alert(`Product ${isEditing ? 'updated' : 'created'} successfully!`);
    } catch (err: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} product:`, err);
      alert(`Failed to ${isEditing ? 'update' : 'create'} product: ${err.message}`);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const categories = {
      1: 'Burgers',
      2: 'Pizzas',
      3: 'Fries',
      4: 'Drinks',
      5: 'Desserts',
    };
    return categories[categoryId as keyof typeof categories] || 'Unknown';
  };

  return (
    <div className="admin-products">
      <div className="admin-section-header">
        <h2>Products Management</h2>
        <p>Manage your product catalog</p>
      </div>

      <div className="admin-controls">
        <button 
          className="admin-dashboard__action-btn admin-dashboard__action-btn--add"
          onClick={handleAddNewProduct}
        >
          Add New Product
        </button>
      </div>

      <div className="admin-content-section">
        {loading ? (
          <div className="admin-dashboard__loading">Loading products...</div>
        ) : error ? (
          <div className="admin-dashboard__error">{error}</div>
        ) : products.length === 0 ? (
          <div className="admin-dashboard__empty">No products found</div>
        ) : (
          <div className="admin-dashboard__products">
            <table className="admin-dashboard__table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Prep Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className="admin-dashboard__product-image" 
                      />
                    </td>
                    <td>{product.title}</td>
                    <td>{getCategoryName(product.category)}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.rating}</td>
                    <td>{product.preparationTime}</td>
                    <td className="admin-dashboard__actions">
                      <button
                        className="admin-dashboard__action-btn admin-dashboard__action-btn--edit"
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-dashboard__action-btn admin-dashboard__action-btn--delete"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-dashboard__modal">
          <div className="admin-dashboard__modal-content">
            <div className="admin-dashboard__modal-header">
              <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
              <button
                className="admin-dashboard__modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="admin-dashboard__modal-body">
              <form onSubmit={handleSubmit} className="admin-dashboard__form">
                <div className="admin-dashboard__form-group">
                  <label htmlFor="productId">Product ID</label>
                  <input
                    type="number"
                    id="productId"
                    name="productId"
                    value={formData.productId || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="admin-dashboard__form-group">
                  <label htmlFor="title">Product Name</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="admin-dashboard__form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0.01"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="admin-dashboard__form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value={1}>Burgers</option>
                    <option value={2}>Pizzas</option>
                    <option value={3}>Fries</option>
                    <option value={4}>Drinks</option>
                    <option value={5}>Desserts</option>
                  </select>
                </div>
                
                <div className="admin-dashboard__form-group">
                  <label htmlFor="preparationTime">Preparation Time</label>
                  <input
                    type="text"
                    id="preparationTime"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="admin-dashboard__form-group">
                  <label htmlFor="imageUrl">Image URL</label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="admin-dashboard__form-group">
                  <label htmlFor="rating">Rating</label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="admin-dashboard__form-actions">
                  <button
                    type="button"
                    className="admin-dashboard__action-btn admin-dashboard__action-btn--cancel"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-dashboard__action-btn admin-dashboard__action-btn--save"
                  >
                    {isEditing ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;