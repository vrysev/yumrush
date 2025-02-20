import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sortType: 0,
  popUp: false,
  category: 0,
};

export const sortSlice = createSlice({
  name: 'sort',
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
  },
});

export const { setSortType, setPopupActive, setActiveCategory } = sortSlice.actions;
export default sortSlice.reducer;
