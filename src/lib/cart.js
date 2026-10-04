import { coupons, TAX_RATE, FREE_SHIPPING_OVER } from "@/data/coupons";
import { formatPrice, isPastDate, salePrice } from "./format";

export function findCoupon(code, subtotal = 0) {
  const coupon = coupons.find((c) => c.code === code.trim().toUpperCase());
  if (!coupon) return { error: "This code isn't valid." };
  if (coupon.expires && isPastDate(coupon.expires)) {
    return { error: "This code has expired." };
  }
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return { error: `Spend ${formatPrice(coupon.minSubtotal)} or more to use ${coupon.code}.` };
  }
  return { coupon };
}

export function getTotals(items, coupon, shippingPrice = 5.99) {
  const subtotal = items.reduce((sum, item) => sum + salePrice(item) * item.qty, 0);

  let discount = 0;
  let shipping = subtotal >= FREE_SHIPPING_OVER || items.length === 0 ? 0 : shippingPrice;

  if (coupon) {
    if (coupon.type === "percent") discount = (subtotal * coupon.value) / 100;
    if (coupon.type === "flat") discount = coupon.value;
    if (coupon.type === "shipping") shipping = 0;
  }

  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + shipping + tax;

  return { subtotal, discount, shipping, tax, total };
}
