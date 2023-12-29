import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  sortType: 0,
  popUp: false,
  category: 0,
};

export const sortSlice = createSlice({
  name: "sort",
  initialState,
  reducers: {
    setSortType(state, action) {
      state.sortType = action.payload;
    },
    setPopupActive(state, action) {
      state.popUp = action.payload;
    },
    setActiveCategory(state, action) {
      state.category = action.payload;
    },
    setParams(state, action) {
      state.sortType = action.payload.sort;
      state.category = action.payload.category;
    },
  },
});

export const { setSortType, setPopupActive, setActiveCategory, setParams } =
  sortSlice.actions;
export default sortSlice.reducer;
