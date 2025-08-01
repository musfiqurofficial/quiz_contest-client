// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/redux/features/cart/cart-slice";
import orderReducer from "@/redux/features/cart/orderSlice";
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
