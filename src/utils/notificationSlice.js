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
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
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

// fetch new videos from subscriptions (parallelized for efficiency)
export const fetchUserNotifications = async (
  subscriptions,
  token,
  lastChecked
) => {
  // Fetch all subscription videos in parallel instead of sequentially
  const fetchPromises = subscriptions.map(async (sub) => {
    const channelId = sub.snippet.resourceId.channelId;
    const channelTitle = sub.snippet.title;

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error(`Failed to fetch videos for channel ${channelId}: ${res.status}`);
        return null;
      }

      const data = await res.json();
      const video = data.items?.[0];
      if (!video) return null;

      const publishedAt = new Date(video.snippet.publishedAt);

      if (!lastChecked || publishedAt > new Date(lastChecked)) {
        return {
          id: video.id.videoId,
          text: `New video from ${channelTitle}: ${video.snippet.title}`,
          isRead: false,
          publishedAt,
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching videos for channel ${channelId}:`, error);
      return null;
    }
  });

  // Wait for all requests to complete in parallel
  const results = await Promise.all(fetchPromises);
  
  // Filter out null results
  return results.filter((notification) => notification !== null);
};
