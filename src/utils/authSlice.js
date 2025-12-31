import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    isLoggedIn: false,
  },
  reducers: {
    setToken: (state, action) => {
      state.accessToken = action.payload;
      state.isLoggedIn = true;
    },
    clearToken: (state) => {
      state.accessToken = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
