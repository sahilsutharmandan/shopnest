import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getTotals } from "@/lib/cart";

export function useCartItems() {
  return useSelector((state) => state.cart.items);
}

export function useCartCount() {
  const items = useCartItems();
  return useMemo(
    () => items.reduce((count, item) => count + (Number(item.qty) || 0), 0),
    [items]
  );
}

export function useCartTotals(shippingPrice) {
  const items = useCartItems();
  const coupon = useSelector((state) => state.cart.coupon);
  return useMemo(() => getTotals(items, coupon, shippingPrice), [items, coupon, shippingPrice]);
}
