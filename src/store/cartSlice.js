import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  coupon: null,
  drawerOpen: false,
};

function normalizeQty(qty) {
  const value = Number(qty);
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
}

function toCartItem(product, qty) {
  return {
    id: product.id,
    title: product.title,
    brand: product.brand,
    thumbnail: product.thumbnail,
    price: product.price,
    discountPercentage: product.discountPercentage,
    stock: product.stock,
    qty: normalizeQty(qty),
  };
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state, action) {
      return { ...state, ...action.payload, items: (action.payload.items || []).map((item) => ({ ...item, qty: normalizeQty(item.qty) })), drawerOpen: false };
    },
    addToCart(state, action) {
      const { product, qty = 1 } = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        existing.qty = normalizeQty(existing.qty) + normalizeQty(qty);
      } else {
        state.items.push(toCartItem(product, qty));
      }
    },
    updateQty(state, action) {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.qty = normalizeQty(qty);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
    },
    applyCoupon(state, action) {
      state.coupon = action.payload;
    },
    removeCoupon(state) {
      state.coupon = null;
    },
    openDrawer(state) {
      state.drawerOpen = true;
    },
    closeDrawer(state) {
      state.drawerOpen = false;
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  updateQty,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  openDrawer,
  closeDrawer,
} = cartSlice.actions;

export default cartSlice.reducer;
