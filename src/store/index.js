import { configureStore } from "@reduxjs/toolkit";
import cart from "./cartSlice";
import wishlist from "./wishlistSlice";
import auth from "./authSlice";
import orders from "./ordersSlice";
import toast from "./toastSlice";

export function makeStore() {
  return configureStore({
    reducer: { cart, wishlist, auth, orders, toast },
  });
}
