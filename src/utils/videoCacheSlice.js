import { createSlice } from "@reduxjs/toolkit";

const MAX_CACHE_VIDEOS = 60; // ⭐ adjust if needed

const videoCacheSlice = createSlice({
  name: "videoCache",
  initialState: {
    videos: [],
    nextPageToken: "",
  },
  reducers: {
    saveVideos: (state, action) => {
      state.videos = action.payload.videos;
      state.nextPageToken = action.payload.nextPageToken;
    },

    addMoreVideos: (state, action) => {
      state.videos.push(...action.payload.videos);

      // 🔥 SLIDING WINDOW CACHE
      if (state.videos.length > MAX_CACHE_VIDEOS) {
        state.videos = state.videos.slice(
          state.videos.length - MAX_CACHE_VIDEOS
        );
      }

      state.nextPageToken = action.payload.nextPageToken;
    },

    clearVideos: (state) => {
      state.videos = [];
      state.nextPageToken = "";
    },
  },
});

export const { saveVideos, addMoreVideos, clearVideos } =
  videoCacheSlice.actions;

export default videoCacheSlice.reducer;
