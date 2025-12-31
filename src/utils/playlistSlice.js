import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playlists: JSON.parse(localStorage.getItem("playlists")) || [],
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    createPlaylist: (state, action) => {
      const { name } = action.payload; // payload is { name: "My Playlist" }
      state.playlists.push({
        id: Date.now(), // unique numeric ID
        name,
        videos: [],
      });
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },

    addVideoToPlaylist: (state, action) => {
      const { playlistId, video } = action.payload;
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist) {
        const exists = playlist.videos.some((v) => v.id === video.id);
        if (!exists) playlist.videos.push(video);
      }
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },

    removeVideoFromPlaylist: (state, action) => {
      const { playlistId, videoId } = action.payload;
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist) {
        playlist.videos = playlist.videos.filter((v) => v.id !== videoId);
      }
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
  },
});

export const { createPlaylist, addVideoToPlaylist, removeVideoFromPlaylist } =
  playlistSlice.actions;

export default playlistSlice.reducer;
