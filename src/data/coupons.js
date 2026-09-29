export const coupons = [
  { code: "SAVE10", type: "percent", value: 10, label: "10% off your order" },
  { code: "FREESHIP", type: "shipping", value: 0, label: "Free shipping" },
  { code: "WELCOME5", type: "flat", value: 5, label: "$5 off", minSubtotal: 30 },
  { code: "EXPIRED20", type: "percent", value: 20, label: "20% off", expires: "2025-12-31" },
];

export const TAX_RATE = 0.08;
export const FREE_SHIPPING_OVER = 50;

export const shippingMethods = [
  { id: "standard", label: "Standard", eta: "4-6 business days", price: 5.99 },
  { id: "express", label: "Express", eta: "1-2 business days", price: 14.99 },
  { id: "pickup", label: "Store pickup", eta: "Ready tomorrow", price: 0 },
];
