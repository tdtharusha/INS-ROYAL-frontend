import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  suppliers: [],
  currentSupplier: null,
  isLoading: false,
  error: null,
};

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    setSuppliers: (state, action) => {
      state.suppliers = action.payload;
    },
    setCurrentSupplier: (state, action) => {
      state.currentSupplier = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setSuppliers, setCurrentSupplier, setLoading, setError } =
  supplierSlice.actions;

export default supplierSlice.reducer;
