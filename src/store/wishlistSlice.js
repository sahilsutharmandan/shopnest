import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] },
  reducers: {
    hydrateWishlist(state, action) {
      state.items = action.payload || [];
    },
    toggleWishlist(state, action) {
      const product = action.payload;
      const index = state.items.findIndex((p) => p.id === product.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          thumbnail: product.thumbnail,
          price: product.price,
          discountPercentage: product.discountPercentage,
          rating: product.rating,
          stock: product.stock,
          brand: product.brand,
          category: product.category,
          availabilityStatus: product.availabilityStatus,
        });
      }
    },
  },
});

export const { hydrateWishlist, toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
