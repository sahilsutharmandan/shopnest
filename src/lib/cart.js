import { coupons, TAX_RATE, FREE_SHIPPING_OVER } from "@/data/coupons";
import { salePrice } from "./format";

export function findCoupon(code) {
  const coupon = coupons.find((c) => c.code === code.trim().toUpperCase());
  if (!coupon) return { error: "This code isn't valid." };
  if (coupon.expires && new Date(coupon.expires) < new Date()) {
    return { error: "This code has expired." };
  }
  return { coupon };
}

export function getTotals(items, coupon, shippingPrice = 5.99) {
  const subtotal = items.reduce((sum, item) => sum + salePrice(item) * item.qty, 0);

  let discount = 0;
  let shipping = subtotal >= FREE_SHIPPING_OVER || items.length === 0 ? 0 : shippingPrice;

  if (coupon) {
    if (coupon.type === "percent") discount = (subtotal * coupon.value) / 100;
    if (coupon.type === "flat" && subtotal >= (coupon.minSubtotal || 0)) discount = coupon.value;
    if (coupon.type === "shipping") shipping = 0;
  }

  discount = Math.round(discount * 100) / 100;
  const tax = Math.round((subtotal - discount) * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal - discount + shipping + tax) * 100) / 100;

  return { subtotal, discount, shipping, tax, total };
}
