// categoryCacheSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  nextPageToken: "",
};

const categoryCacheSlice = createSlice({
  name: "categoryCache",
  initialState,
  reducers: {
    saveCategories: (state, action) => {
      state.categories = action.payload.categories;
      state.nextPageToken = action.payload.nextPageToken || "";
    },
    addMoreCategories: (state, action) => {
      state.categories = [...state.categories, ...action.payload.categories];
      state.nextPageToken = action.payload.nextPageToken || "";
    },
    clearCategoryCache: (state) => {
      state.categories = [];
      state.nextPageToken = "";
    },
  },
});

export const { saveCategories, addMoreCategories, clearCategoryCache } =
  categoryCacheSlice.actions;

export default categoryCacheSlice.reducer;
