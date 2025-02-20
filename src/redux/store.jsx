import { configureStore } from '@reduxjs/toolkit';
import sort from './slices/sortSlice.jsx';
import search from './slices/searchSlice.jsx';
export const store = configureStore({
  reducer: {
    sort,
    search,
  },
});
