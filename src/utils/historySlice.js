import { createSlice } from "@reduxjs/toolkit";

const historySlice = createSlice({
  name: "history",
  initialState: {
    videos: JSON.parse(localStorage.getItem("historyVideos")) || [],
  },
  reducers: {
    addToHistory: (state, action) => {
      // Remove duplicate if video already exists
      state.videos = state.videos.filter((v) => v.id !== action.payload.id);

      // Add latest video on top
      state.videos.unshift(action.payload);

      // Save to localStorage
      localStorage.setItem("historyVideos", JSON.stringify(state.videos));
    },

    clearHistory: (state) => {
      state.videos = [];
      localStorage.removeItem("historyVideos");
    },
  },
});

export const { addToHistory, clearHistory } = historySlice.actions;
export default historySlice.reducer;
