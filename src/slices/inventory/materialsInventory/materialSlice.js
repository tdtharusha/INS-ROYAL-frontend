import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  materialItems: [],
  status: 'idle',
  error: null,
};

const materialSlice = createSlice({
  name: 'material',
  initialState,
  reducers: {
    setMaterialsInventoryItems: (state, action) => {
      state.inventoryItems = action.payload;
    },
    addMaterialsInventoryItem: (state, action) => {
      state.inventoryItems.push(action.payload);
    },
    updateMaterialsInventoryItem: (state, action) => {
      const index = state.inventoryItems.findIndex(
        (item) => item.productName === action.payload.productName
      );
      if (index !== -1) {
        state.inventoryItems[index] = action.payload;
      }
    },
    removeMaterialsInventoryItem: (state, action) => {
      state.inventoryItems = state.inventoryItems.filter(
        (item) => item.productName !== action.payload
      );
    },
  },
});

export const {
  setMaterialsInventoryItems,
  addMaterialsInventoryItem,
  updateMaterialsInventoryItem,
  removeMaterialsInventoryItem,
} = materialSlice.actions;

export default materialSlice.reducer;
