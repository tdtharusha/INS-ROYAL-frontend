import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dailyProducts: [],
  loading: false,
  error: null,
};

const dailyProductSlice = createSlice({
  name: 'dailyProduct',
  initialState,
  reducers: {
    setDailyProducts: (state, action) => {
      state.dailyProducts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setDailyProducts, setLoading, setError } =
  dailyProductSlice.actions;

export default dailyProductSlice.reducer;
