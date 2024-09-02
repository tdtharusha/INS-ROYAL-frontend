import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  preMadeItems: [],
  status: 'idle',
  error: null,
};

const preMadeFoodSlice = createSlice({
  name: 'preMadeFood',
  initialState,
  reducers: {
    setInventoryItems: (state, action) => {
      state.inventoryItems = action.payload;
    },
    addInventoryItem: (state, action) => {
      state.inventoryItems.push(action.payload);
    },
    updateInventoryItem: (state, action) => {
      const index = state.inventoryItems.findIndex(
        (item) => item.productName === action.payload.productName
      );
      if (index !== -1) {
        state.inventoryItems[index] = action.payload;
      }
    },
    removeInventoryItem: (state, action) => {
      state.inventoryItems = state.inventoryItems.filter(
        (item) => item.productName !== action.payload
      );
    },
  },
});

export const {
  setInventoryItems,
  addInventoryItem,
  updateInventoryItem,
  removeInventoryItem,
} = preMadeFoodSlice.actions;

export default preMadeFoodSlice.reducer;
