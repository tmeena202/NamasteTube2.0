import { createSlice } from "@reduxjs/toolkit";

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState: [],
  reducers: {
    setSubscriptions: (state, action) => {
      return action.payload;
    },
    clearSubscriptions: () => {
      return [];
    },
  },
});

export const { setSubscriptions, clearSubscriptions } =
  subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;
