import { createSlice } from "@reduxjs/toolkit";

const ordersSlice = createSlice({
  name: "orders",
  initialState: { list: [] },
  reducers: {
    hydrateOrders(state, action) {
      state.list = action.payload || [];
    },
    placeOrder(state, action) {
      state.list.unshift(action.payload);
    },
  },
});

export const { hydrateOrders, placeOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
