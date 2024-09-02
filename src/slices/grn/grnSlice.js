import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  grns: [],
  currentGRN: null,
  isLoading: false,
  error: null,
};

const grnSlice = createSlice({
  name: 'grn',
  initialState,
  reducers: {
    setGRNs: (state, action) => {
      state.grns = action.payload;
    },
    setCurrentGRN: (state, action) => {
      state.currentGRN = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setGRNs, setCurrentGRN, setLoading, setError } =
  grnSlice.actions;

export default grnSlice.reducer;
