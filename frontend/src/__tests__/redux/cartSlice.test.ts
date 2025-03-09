import cartReducer, { 
  addToCart, 
  removeFromCart, 
  updateQuantity,
  clearCart
} from '../../redux/slices/cartSlice';
import { ProductType } from '@/types/product';

describe('Cart Slice', () => {
  const initialState = {
    items: [],
    isOpen: false,
    totalQuantity: 0,
    totalAmount: 0
  };

  const mockProduct: ProductType = {
    _id: '1',
    title: 'Margherita Pizza',
    price: 12.99,
    imageUrl: '/images/pizzas/margherita.png',
    rating: 4.5,
    preparationTime: '20 min',
    category: 1,
    description: 'Delicious pizza'
  };

  it('should handle initial state', () => {
    // We need to account for localStorage in the test now
    const result = cartReducer(undefined, { type: 'unknown' });
    expect(result.items).toEqual(expect.any(Array));
    expect(result.isOpen).toBe(false);
  });

  it('should handle addToCart with new item', () => {
    const actual = cartReducer(initialState, addToCart(mockProduct));
    expect(actual.items.length).toEqual(1);
    expect(actual.items[0].title).toEqual('Margherita Pizza');
    expect(actual.items[0].quantity).toEqual(1);
    expect(actual.totalQuantity).toEqual(1);
    expect(actual.totalAmount).toEqual(12.99);
  });

  it('should handle addToCart with existing item', () => {
    const stateWithItem = {
      items: [{ ...mockProduct, quantity: 1 }],
      isOpen: false,
      totalQuantity: 1,
      totalAmount: 12.99
    };
    const actual = cartReducer(stateWithItem, addToCart(mockProduct));
    expect(actual.items.length).toEqual(1);
    expect(actual.items[0].quantity).toEqual(2);
    expect(actual.totalQuantity).toEqual(2);
    expect(actual.totalAmount).toEqual(25.98);
  });

  it('should handle removeFromCart', () => {
    const stateWithItem = {
      items: [{ ...mockProduct, quantity: 1 }],
      isOpen: false,
      totalQuantity: 1,
      totalAmount: 12.99
    };
    const actual = cartReducer(stateWithItem, removeFromCart('1'));
    expect(actual.items.length).toEqual(0);
    expect(actual.totalQuantity).toEqual(0);
    expect(actual.totalAmount).toEqual(0);
  });

  it('should handle updateQuantity to decrease when quantity > 1', () => {
    const stateWithItems = {
      items: [{ ...mockProduct, quantity: 2 }],
      isOpen: false,
      totalQuantity: 2,
      totalAmount: 25.98
    };
    const actual = cartReducer(stateWithItems, updateQuantity({ id: '1', quantity: 1 }));
    expect(actual.items.length).toEqual(1);
    expect(actual.items[0].quantity).toEqual(1);
    expect(actual.totalQuantity).toEqual(1);
    expect(actual.totalAmount).toEqual(12.99);
  });

  it('should handle updateQuantity to remove when quantity = 0', () => {
    const stateWithItems = {
      items: [{ ...mockProduct, quantity: 1 }],
      isOpen: false,
      totalQuantity: 1,
      totalAmount: 12.99
    };
    const actual = cartReducer(stateWithItems, updateQuantity({ id: '1', quantity: 0 }));
    expect(actual.items.length).toEqual(0);
    expect(actual.totalQuantity).toEqual(0);
    expect(actual.totalAmount).toEqual(0);
  });

  it('should handle clearCart', () => {
    const stateWithItems = {
      items: [
        { ...mockProduct, quantity: 1 }, 
        { ...mockProduct, _id: '2', title: 'Burger', quantity: 1 }
      ],
      isOpen: false,
      totalQuantity: 2,
      totalAmount: 25.98
    };
    const actual = cartReducer(stateWithItems, clearCart());
    expect(actual.items.length).toEqual(0);
    expect(actual.totalQuantity).toEqual(0);
    expect(actual.totalAmount).toEqual(0);
  });
});