import cartReducer, { 
  addToCart, 
  removeFromCart, 
  decreaseQuantity,
  clearCart
} from '../../redux/slices/cartSlice';

describe('Cart Slice', () => {
  const initialState = {
    cartItems: [],
    showCart: false,
  };

  const mockProduct = {
    _id: '1',
    title: 'Margherita Pizza',
    price: 12.99,
    imageUrl: '/images/pizzas/margherita.png',
    quantity: 1,
  };

  it('should handle initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual({
      cartItems: [],
      showCart: false,
    });
  });

  it('should handle addToCart with new item', () => {
    const actual = cartReducer(initialState, addToCart(mockProduct));
    expect(actual.cartItems.length).toEqual(1);
    expect(actual.cartItems[0].title).toEqual('Margherita Pizza');
    expect(actual.cartItems[0].quantity).toEqual(1);
  });

  it('should handle addToCart with existing item', () => {
    const stateWithItem = {
      cartItems: [{ ...mockProduct, quantity: 1 }],
      showCart: false,
    };
    const actual = cartReducer(stateWithItem, addToCart(mockProduct));
    expect(actual.cartItems.length).toEqual(1);
    expect(actual.cartItems[0].quantity).toEqual(2);
  });

  it('should handle removeFromCart', () => {
    const stateWithItem = {
      cartItems: [mockProduct],
      showCart: false,
    };
    const actual = cartReducer(stateWithItem, removeFromCart('1'));
    expect(actual.cartItems.length).toEqual(0);
  });

  it('should handle decreaseQuantity when quantity > 1', () => {
    const stateWithItems = {
      cartItems: [{ ...mockProduct, quantity: 2 }],
      showCart: false,
    };
    const actual = cartReducer(stateWithItems, decreaseQuantity('1'));
    expect(actual.cartItems.length).toEqual(1);
    expect(actual.cartItems[0].quantity).toEqual(1);
  });

  it('should handle decreaseQuantity when quantity = 1', () => {
    const stateWithItems = {
      cartItems: [{ ...mockProduct, quantity: 1 }],
      showCart: false,
    };
    const actual = cartReducer(stateWithItems, decreaseQuantity('1'));
    expect(actual.cartItems.length).toEqual(0);
  });

  it('should handle clearCart', () => {
    const stateWithItems = {
      cartItems: [mockProduct, { ...mockProduct, _id: '2', title: 'Burger' }],
      showCart: false,
    };
    const actual = cartReducer(stateWithItems, clearCart());
    expect(actual.cartItems.length).toEqual(0);
  });
});