import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  subTotal: 0,
  discount: 0,
  totalAmount: 0,
};

const ShoppingCartSlice = createSlice({
  name: 'ShoppingCart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item._id === newItem._id
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.cartItems.push({ newItem });
      }

      state.totalQuantity += newItem.quantity;
      state.subTotal += newItem.unitPrice * newItem.quantity;

      //state.subTotal -= existingItem.unitPrice * existingItem.quantity;
      state.totalAmount = state.subTotal - state.discount;
    },
    removeFromCart: (state, action) => {
      const idToRemove = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.newItem._id !== idToRemove
      );

      // Recalculate totalQuantity and other totals
      state.totalQuantity = state.cartItems.reduce(
        (total, item) => total + item.newItem.quantity,
        0
      );
      state.subTotal = state.cartItems.reduce(
        (total, item) => total + item.newItem.unitPrice * item.newItem.quantity,
        0
      );
      state.totalAmount = state.subTotal - state.discount;
    },
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item._id === id);

      if (item) {
        const quantityDifference = quantity - item.quantity;
        item.quantity = quantity;
        state.totalQuantity += quantityDifference;
        // state.totalAmount += item.unitPrice * quantityDifference;
        state.subTotal += item.unitPrice * quantityDifference;
        state.totalAmount = state.subTotal - state.discount;
      }
    },
    updateDiscount: (state, action) => {
      state.discount = action.payload;
      state.subTotal = state.subTotal - state.discount;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.subTotal = 0;
      state.discount = 0;
      state.totalAmount = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  updateDiscount,
  clearCart,
} = ShoppingCartSlice.actions;

export default ShoppingCartSlice.reducer;
