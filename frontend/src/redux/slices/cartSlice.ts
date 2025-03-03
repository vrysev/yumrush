import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductType } from '@/types/product';

export interface CartItem extends ProductType {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalQuantity: number;
  totalAmount: number;
}

// Get cart data from localStorage if available
const cartFromStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart') || '{}')
  : { items: [], totalQuantity: 0, totalAmount: 0 };

const initialState: CartState = {
  items: cartFromStorage.items || [],
  isOpen: false,
  totalQuantity: cartFromStorage.totalQuantity || 0,
  totalAmount: cartFromStorage.totalAmount || 0,
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return { totalQuantity, totalAmount };
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart: Omit<CartState, 'isOpen'>) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ProductType>) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item._id === newItem._id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }

      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      
      saveCartToStorage({
        items: state.items,
        totalQuantity,
        totalAmount
      });
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item._id !== itemId);
      
      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
      
      saveCartToStorage({
        items: state.items,
        totalQuantity,
        totalAmount
      });
    },
    
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item._id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item._id !== id);
        } else {
          item.quantity = quantity;
        }
        
        const { totalQuantity, totalAmount } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
        
        saveCartToStorage({
          items: state.items,
          totalQuantity,
          totalAmount
        });
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      
      saveCartToStorage({
        items: [],
        totalQuantity: 0,
        totalAmount: 0
      });
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    openCart: (state) => {
      state.isOpen = true;
    },
    
    closeCart: (state) => {
      state.isOpen = false;
    }
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  toggleCart, 
  openCart, 
  closeCart 
} = cartSlice.actions;

export default cartSlice.reducer;