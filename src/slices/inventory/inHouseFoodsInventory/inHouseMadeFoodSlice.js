import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  inHouseItems: [],
  status: 'idle',
  error: null,
};

const inHouseFoodlSlice = createSlice({
  name: 'inHouseMadeFood',
  initialState,
  reducers: {
    setInHouseMadeFoodInventoryItems: (state, action) => {
      state.inventoryItems = action.payload;
    },
    addInHouseMadeFoodInventoryItem: (state, action) => {
      state.inventoryItems.push(action.payload);
    },
    updateInHouseMadeFoodInventoryItem: (state, action) => {
      const index = state.inventoryItems.findIndex(
        (item) => item.productName === action.payload.productName
      );
      if (index !== -1) {
        state.inventoryItems[index] = action.payload;
      }
    },
    removeInHouseMadeFoodInventoryItem: (state, action) => {
      state.inventoryItems = state.inventoryItems.filter(
        (item) => item.productName !== action.payload
      );
    },
  },
});

export const {
  setInHouseMadeFoodInventoryItems,
  addInHouseMadeFoodInventoryItem,
  updateInHouseMadeFoodInventoryItem,
  removeInHouseMadeFoodInventoryItem,
} = inHouseFoodlSlice.actions;

export default inHouseFoodlSlice.reducer;
