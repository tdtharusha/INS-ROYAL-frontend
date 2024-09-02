import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  topProducts: [],
  product: null,
  loading: false,
  error: null,
  page: 1,
  pages: 1,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPages: (state, action) => {
      state.pages = action.payload;
    },
  },
});

export const {
  setProducts,
  setProduct,
  setLoading,
  setError,
  setPage,
  setPages,
} = productSlice.actions;

export default productSlice.reducer;
