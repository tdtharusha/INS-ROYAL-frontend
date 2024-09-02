import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [],
  status: 'idle',
  error: null,
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
    clearSelectedBrand: (state) => {
      state.selectedBrand = null;
    },
  },
  //extraReducers: (builder) => {},
});

export const { setSelectedBrand, clearSelectedBrand } = brandSlice.actions;

export default brandSlice.reducer;
