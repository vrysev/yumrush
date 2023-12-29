import { configureStore } from "@reduxjs/toolkit";
import sort from "./slices/sortSlice.jsx";
export const store = configureStore({
  reducer: {
    sort,
  },
});
