import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { Search } from "lucide-react";

import { toggleMenu } from "../utils/appSlice";
import { YOUTUBE_SEARCH_API } from "../utils/constants";
import { cacheResults } from "../utils/searchSlice";
import { setToken, clearToken } from "../utils/authSlice";
import {
  setSubscriptions,
  clearSubscriptions,
} from "../utils/subscriptionsSlice";

import {
  setNotifications,
  clearNotifications,
  fetchUserInfo,
  fetchUserNotifications,
  getUserNotifications,
  saveUserNotifications,
  getLastChecked,
  setLastChecked,
  startLoading, // ✅ NEW
  stopLoading, // ✅ NEW
} from "../utils/notificationSlice";

import NotificationPanel from "./NotificationPanel";

const Head = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchCache = useSelector((store) => store.search);
  const auth = useSelector((store) => store.auth);
  const notifications = useSelector((store) => store.notifications.list);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* 🔍 SEARCH SUGGESTIONS */
  const getSearchSuggestions = useCallback(async (query) => {
    try {
      const res = await fetch(YOUTUBE_SEARCH_API + query);
      const json = await res.json();
      setSuggestions(json[1] || []);
      dispatch(cacheResults({ [query]: json[1] || [] }));
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSuggestions([]);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      if (searchCache[searchQuery]) {
        setSuggestions(searchCache[searchQuery]);
      } else {
        getSearchSuggestions(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchCache, getSearchSuggestions]);

  /* 🔍 HANDLE SEARCH */
  const handleSearch = (queryToSearch = searchQuery) => {
    if (!queryToSearch.trim()) return;
    setShowSuggestions(false);
    navigate(`/results?search_query=${encodeURIComponent(queryToSearch.trim())}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  /* 📺 FETCH SUBSCRIPTIONS */
  const fetchSubscriptions = async (token) => {
    const res = await fetch(
      "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=25",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    return data.items || [];
  };

  /* 🔐 GOOGLE LOGIN */
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token;
      dispatch(setToken(token));

      dispatch(startLoading()); // ✅ START NOTIFICATION LOADING

      const subs = await fetchSubscriptions(token);
      dispatch(setSubscriptions(subs));

      const userInfo = await fetchUserInfo(token);
      const userKey = userInfo.email;

      const oldNotifications = getUserNotifications(userKey);
      const lastChecked = getLastChecked(userKey);

      const newNotifications = await fetchUserNotifications(
        subs,
        token,
        lastChecked
      );

      const allNotifications = [...newNotifications, ...oldNotifications];

      saveUserNotifications(userKey, allNotifications);
      setLastChecked(userKey);

      dispatch(setNotifications(allNotifications));
      dispatch(stopLoading()); // ✅ STOP LOADING
    },
  });

  return (
    <div className="flex items-center justify-between px-4 h-14 bg-white fixed top-0 left-0 right-0 z-50 shadow">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <img
          onClick={() => dispatch(toggleMenu())}
          className="h-6 cursor-pointer"
          alt="menu"
          src="https://cdn-icons-png.flaticon.com/512/1828/1828859.png"
        />

        <img
          className="h-14 cursor-pointer"
          alt="youtube logo"
          src="https://logos-world.net/wp-content/uploads/2020/06/YouTube-Logo.png"
          onClick={() => navigate("/")}
        />
      </div>

      {/* SEARCH */}
      <div className="relative w-[40%] flex items-center">
        <div className="relative flex-1 flex items-center border border-gray-300 rounded-l-full rounded-r-none focus-within:border-blue-500">
          <input
            className="w-full px-4 py-2 focus:outline-none rounded-l-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search"
          />
          {/* Search Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseDown={(e) => e.preventDefault()} // Prevent onBlur from firing
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                >
                  <Search size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => handleSearch()}
          className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 transition-colors flex items-center justify-center focus:outline-none"
        >
          <Search size={18} className="text-gray-600" />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">
        {/* 🔔 NOTIFICATIONS */}
        <div className="relative">
          <span
            onClick={() => setShowNotifications(true)}
            className="text-2xl cursor-pointer"
          >
            🔔
          </span>

          {auth.isLoggedIn && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              {unreadCount}
            </span>
          )}

          {showNotifications &&
            (auth.isLoggedIn ? (
              <NotificationPanel />
            ) : (
              <div className="absolute right-0 mt-2 w-64 bg-white border shadow rounded p-4 text-sm text-gray-700">
                Please sign in to see your notifications
              </div>
            ))}
        </div>

        {/* ⭐ GEMINI */}
        <div
          onClick={() => navigate("/gemini")}
          title="Ask Gemini"
          className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 shadow-sm"
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/055/687/065/non_2x/gemini-google-icon-symbol-logo-free-png.png"
            alt="Gemini"
            className="h-8 w-8"
          />
          <span className="font-semibold text-gray-800 text-sm">GEMINI</span>
        </div>

        {/* AUTH */}
        {!auth.isLoggedIn ? (
          <button
            onClick={login}
            className="px-4 py-1 bg-blue-500 text-white rounded"
          >
            Sign In
          </button>
        ) : (
          <button
            onClick={() => {
              googleLogout();
              dispatch(clearToken());
              dispatch(clearSubscriptions());
              dispatch(clearNotifications());
            }}
            className="px-4 py-1 bg-gray-200 rounded"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Head;
