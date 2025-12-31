import { createSlice } from "@reduxjs/toolkit";

const likedVideosSlice = createSlice({
  name: "likedVideos",
  initialState: [],
  reducers: {
    addLikedVideo: (state, action) => {
      const exists = state.find((video) => video.id === action.payload.id);
      if (!exists) state.push(action.payload);
    },
    removeLikedVideo: (state, action) => {
      return state.filter((video) => video.id !== action.payload.id);
    },
  },
});

export const { addLikedVideo, removeLikedVideo } = likedVideosSlice.actions;
export default likedVideosSlice.reducer;
