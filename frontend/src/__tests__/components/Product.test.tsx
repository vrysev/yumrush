import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Product from '../../components/products/Product';
import { ProductType } from '@/types/product';

// Mock translation functions
jest.mock('../../utils/translationUtils', () => ({
  translateBackendData: (text: string) => text,
  translateDescription: (text: string) => text
}));

// Mock image utils
jest.mock('../../utils/imageUtils', () => ({
  formatImageUrl: (url: string) => url,
  getDefaultImage: () => '/default-image.png'
}));

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock the redux store
const mockStore = configureStore([]);

describe('Product Component', () => {
  let store: any;
  const mockProduct: ProductType = {
    _id: '1',
    title: 'Margherita Pizza',
    price: 12.99,
    imageUrl: '/images/pizzas/margherita.png',
    category: 1,
    rating: 4.5,
    preparationTime: '25 min',
    description: 'Delicious pizza'
  };

  beforeEach(() => {
    store = mockStore({
      cart: {
        items: [],
        isOpen: false,
        totalQuantity: 0,
        totalAmount: 0
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
          <Product {...mockProduct} />
        </BrowserRouter>
      </Provider>
    );
  };

  it('should render product details correctly', () => {
    renderProduct();
    
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  it('should dispatch add to cart action when add button is clicked', () => {
    renderProduct();
    
    const addToCartButton = screen.getByRole('button', { name: /add.to.cart/i });
    fireEvent.click(addToCartButton);
    
    expect(store.dispatch).toHaveBeenCalled();
  });
});
