import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import searchSlice from "./searchSlice";
import chatSlice from "./chatSlice";
import authSlice from "./authSlice";
import subscriptionsSlice from "./subscriptionsSlice";
import historySlice from "./historySlice";
import likedVideosSlice from "./likedVideosSlice";
import playlistSlice from "./playlistSlice";
import notificationSlice from "./notificationSlice";
import videoCacheSlice from "./videoCacheSlice";
import categoryCacheSlice from "./categoryCacheSlice";

const store = configureStore({
  reducer: {
    app: appSlice,
    search: searchSlice,
    chat: chatSlice,
    auth: authSlice,
    subscriptions: subscriptionsSlice,
    history: historySlice,
    likedVideos: likedVideosSlice,
    playlist: playlistSlice,
    notifications: notificationSlice,
    videoCache: videoCacheSlice,
    categoryCache: categoryCacheSlice,
  },
});

export default store;
