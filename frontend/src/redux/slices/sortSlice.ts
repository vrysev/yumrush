import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SortState {
  sortType: number;
  popUp: boolean;
  category: number;
}

const initialState: SortState = {
  sortType: 0,
  popUp: false,
  category: 0,
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
  },
});

export const { setSortType, setPopupActive, setActiveCategory } = sortSlice.actions;
export default sortSlice.reducer;
