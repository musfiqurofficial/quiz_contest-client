// features/orders/orderSlice.ts
import { createSlice } from "@reduxjs/toolkit";

let id = 1;

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
  },
  reducers: {
    placeOrder: (state, action) => {
      state.orders.push({
        id: id++,
        ...action.payload,
        date: new Date().toISOString(),
      });
    },
  },
});

export const { placeOrder } = orderSlice.actions;
export default orderSlice.reducer;
