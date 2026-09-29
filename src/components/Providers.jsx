"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store";
import { hydrateCart } from "@/store/cartSlice";
import { hydrateWishlist } from "@/store/wishlistSlice";
import { hydrateAuth } from "@/store/authSlice";
import { hydrateOrders } from "@/store/ordersSlice";
import { load, save } from "@/lib/storage";

export default function Providers({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const store = storeRef.current;
    store.dispatch(hydrateCart(load("cart", { items: [], coupon: null })));
    store.dispatch(hydrateWishlist(load("wishlist", [])));
    store.dispatch(hydrateAuth(load("user", null)));
    store.dispatch(hydrateOrders(load("orders", [])));

    const unsubscribe = store.subscribe(() => {
      const { cart, wishlist, auth, orders } = store.getState();
      save("cart", { items: cart.items, coupon: cart.coupon });
      save("wishlist", wishlist.items);
      save("user", auth.user);
      save("orders", orders.list);
    });
    return unsubscribe;
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
