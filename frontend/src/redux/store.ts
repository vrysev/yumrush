import { configureStore } from '@reduxjs/toolkit';
import sort from './slices/sortSlice';
import search from './slices/searchSlice';
import auth from './slices/authSlice';
import cart from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    sort,
    search,
    auth,
    cart,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
