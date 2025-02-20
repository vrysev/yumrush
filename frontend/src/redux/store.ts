import { configureStore } from '@reduxjs/toolkit';
import sort from './slices/sortSlice.ts';
import search from './slices/searchSlice.ts';
export const store = configureStore({
  reducer: {
    sort,
    search,
  },
});
