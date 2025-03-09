import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Product from '../../components/products/Product';

// Mock the redux store
const mockStore = configureStore([]);

describe('Product Component', () => {
  let store: any;
  const mockProduct = {
    _id: '1',
    title: 'Margherita Pizza',
    price: 12.99,
    imageUrl: '/images/pizzas/margherita.png',
    category: 1,
    rating: 4.5,
    preparationTime: '25 min',
  };

  beforeEach(() => {
    store = mockStore({
      cart: {
        cartItems: [],
      },
      auth: {
        isAuthenticated: true,
      },
    });
    store.dispatch = jest.fn();
  });

  const renderProduct = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Product product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );
  };

  it('should render product details correctly', () => {
    renderProduct();
    
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByText('25 min')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('should dispatch add to cart action when add button is clicked', () => {
    renderProduct();
    
    const addToCartButton = screen.getByRole('button', { name: /add.to.cart/i });
    fireEvent.click(addToCartButton);
    
    expect(store.dispatch).toHaveBeenCalled();
  });
});