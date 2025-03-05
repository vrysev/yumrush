import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SortState {
  sortType: number;
  popUp: boolean;
  category: number;
  categoryId: string;
}

const initialState: SortState = {
  sortType: 0,
  popUp: false,
  category: 0,
  categoryId: 'pizza',
};

const sortSlice = createSlice({
  name: 'sort',
  initialState,
  reducers: {
    setSortType: (state, action: PayloadAction<number>) => {
      state.sortType = action.payload;
    },
    setPopupActive: (state, action: PayloadAction<boolean>) => {
      state.popUp = action.payload;
    },
    setActiveCategory: (state, action: PayloadAction<number>) => {
      state.category = action.payload;
    },
    scrollToCategory: (state, action: PayloadAction<string>) => {
      state.categoryId = action.payload.toLowerCase();
    },
  },
});

export const { setSortType, setPopupActive, setActiveCategory, scrollToCategory } = sortSlice.actions;
export default sortSlice.reducer;
