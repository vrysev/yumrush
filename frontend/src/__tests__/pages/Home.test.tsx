import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Home from '../../pages/Home';

// Mock the components that Home uses
jest.mock('../../components/common/Hero/Hero', () => () => <div data-testid="hero">Hero Component</div>);
jest.mock('../../components/categories/Categories', () => () => <div data-testid="categories">Categories Component</div>);
jest.mock('../../components/products/Product', () => ({ product }) => (
  <div data-testid={`product-${product._id}`}>{product.title}</div>
));

const mockStore = configureStore([]);

describe('Home Page', () => {
  let store: any;
  
  beforeEach(() => {
    store = mockStore({
      auth: {
        isAuthenticated: false,
      },
      cart: {
        cartItems: [],
      },
      products: {
        products: [
          {
            _id: '1',
            title: 'Pizza',
            price: 12.99,
            category: 1,
          },
          {
            _id: '2',
            title: 'Burger',
            price: 9.99,
            category: 2,
          },
        ],
        loading: false,
        error: null,
      },
      sort: {
        sortBy: '',
      },
      search: {
        searchQuery: '',
      },
    });
  });

  it('should render home page with all components', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('categories')).toBeInTheDocument();
    expect(screen.getByTestId('product-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-2')).toBeInTheDocument();
  });

  it('should filter products based on search query', () => {
    store = mockStore({
      ...store.getState(),
      search: {
        searchQuery: 'pizza',
      },
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByTestId('product-1')).toBeInTheDocument();
    expect(screen.queryByTestId('product-2')).not.toBeInTheDocument();
  });
});