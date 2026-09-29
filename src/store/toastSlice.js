import { createSlice, nanoid } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: { list: [] },
  reducers: {
    showToast: {
      reducer(state, action) {
        state.list.push(action.payload);
      },
      prepare(message, type = "success") {
        return { payload: { id: nanoid(), message, type } };
      },
    },
    dismissToast(state, action) {
      state.list = state.list.filter((t) => t.id !== action.payload);
    },
  },
});

export const { showToast, dismissToast } = toastSlice.actions;
export default toastSlice.reducer;
