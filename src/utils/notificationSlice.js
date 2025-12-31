import { createSlice } from "@reduxjs/toolkit";

/* ================= REDUX SLICE ================= */

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    isLoading: false, // ✅ ADD LOADING STATE
  },
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setNotifications: (state, action) => {
      state.list = action.payload;
    },
    markAsRead: (state, action) => {
      const n = state.list.find((x) => x.id === action.payload);
      if (n) n.isRead = true;
    },
    clearNotifications: (state) => {
      state.list = [];
    },
  },
});

export const {
  startLoading,
  stopLoading,
  setNotifications,
  markAsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;

/* ================= API HELPERS ================= */

// fetch logged-in user info
export const fetchUserInfo = async (token) => {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

// get saved notifications
export const getUserNotifications = (userKey) => {
  const data = localStorage.getItem(`yt_notifications_${userKey}`);
  return data ? JSON.parse(data) : [];
};

// save notifications
export const saveUserNotifications = (userKey, notifications) => {
  localStorage.setItem(
    `yt_notifications_${userKey}`,
    JSON.stringify(notifications)
  );
};

// last checked time
export const getLastChecked = (userKey) =>
  localStorage.getItem(`yt_last_checked_${userKey}`);

export const setLastChecked = (userKey) =>
  localStorage.setItem(`yt_last_checked_${userKey}`, new Date().toISOString());

// fetch new videos from subscriptions
export const fetchUserNotifications = async (
  subscriptions,
  token,
  lastChecked
) => {
  const notifications = [];

  for (const sub of subscriptions) {
    const channelId = sub.snippet.resourceId.channelId;
    const channelTitle = sub.snippet.title;

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    const video = data.items?.[0];
    if (!video) continue;

    const publishedAt = new Date(video.snippet.publishedAt);

    if (!lastChecked || publishedAt > new Date(lastChecked)) {
      notifications.push({
        id: video.id.videoId,
        text: `New video from ${channelTitle}: ${video.snippet.title}`,
        isRead: false,
        publishedAt,
      });
    }
  }

  return notifications;
};
