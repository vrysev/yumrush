import { configureStore } from '@reduxjs/toolkit';
import sort from './slices/sortSlice';
import search from './slices/searchSlice';

export const store = configureStore({
  reducer: {
    sort,
    search,
  },
});
