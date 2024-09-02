import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  page: 1,
  pageSize: 10,
  totalCount: 0,
  sort: {},
  filter: {},
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
  },
});

export const { setOrders } = orderSlice.actions;

export default orderSlice.reducer;
