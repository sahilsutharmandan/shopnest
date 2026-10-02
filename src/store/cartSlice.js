import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  coupon: null,
  drawerOpen: false,
};

function toCartItem(product, qty) {
  return {
    id: product.id,
    title: product.title,
    brand: product.brand,
    thumbnail: product.thumbnail,
    price: product.price,
    discountPercentage: product.discountPercentage,
    stock: product.stock,
    qty: Math.max(1, Number(qty) || 1),
  };
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state, action) {
      const items = (action.payload?.items || []).map((item) => ({
        ...item,
        qty: Math.max(1, Number(item.qty) || 1),
      }));
      return { ...state, ...action.payload, items, drawerOpen: false };
    },
    addToCart(state, action) {
      const { product } = action.payload;
      const qty = Math.max(1, Number(action.payload.qty) || 1);
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        existing.qty = Number(existing.qty || 0) + qty;
      } else {
        state.items.push(toCartItem(product, qty));
      }
    },
    updateQty(state, action) {
      const { id } = action.payload;
      const qty = Math.max(1, Number(action.payload.qty) || 1);
      const item = state.items.find((i) => i.id === id);
      if (item) item.qty = qty;
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
