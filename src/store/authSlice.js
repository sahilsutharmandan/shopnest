import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    hydrateAuth(state, action) {
      state.user = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { hydrateAuth, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
