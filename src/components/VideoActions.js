import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLikedVideo, removeLikedVideo } from "../utils/likedVideosSlice";
import { ThumbsUp, ThumbsDown, Share2, MoreVertical, ListPlus } from "lucide-react";

const VideoActions = ({ videoData, videoId, onOpenPlaylistModal }) => {
  const dispatch = useDispatch();
  const likedVideos = useSelector((store) => store.likedVideos);
  const isLiked = likedVideos.some((video) => video.id === videoId);

  const [isDisliked, setIsDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const channelTitle = videoData?.snippet?.channelTitle;
  const likeCount = Number(videoData?.statistics?.likeCount || 0);

  // Like handler
  const handleLikeClick = () => {
    if (!videoData) return;
    if (isLiked) dispatch(removeLikedVideo(videoData));
    else {
      dispatch(addLikedVideo(videoData));
      setIsDisliked(false);
    }
  };

  // Dislike handler
  const handleDislike = () => {
    if (isDisliked) setIsDisliked(false);
    else {
      setIsDisliked(true);
      if (isLiked) dispatch(removeLikedVideo(videoData));
    }
  };

  // Subscribe handler
  const handleSubscribe = () => {
    setSubscribed((prev) => !prev);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
      {/* Channel Info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
          {channelTitle?.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm">{channelTitle}</p>
          <p className="text-gray-500 text-xs">2.5M subscribers</p>
        </div>
        <button
          onClick={handleSubscribe}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 flex-shrink-0 ${
            subscribed
              ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {subscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Like */}
        <button
          onClick={handleLikeClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
            isLiked
              ? "bg-gray-200 text-gray-900"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} />
          <span className="text-sm font-medium hidden sm:inline">
            {likeCount > 0 ? (likeCount / 1000).toFixed(1) + "K" : "Like"}
          </span>
        </button>

        {/* Dislike */}
        <button
          onClick={handleDislike}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
            isDisliked
              ? "bg-gray-200 text-gray-900"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ThumbsDown size={18} fill={isDisliked ? "currentColor" : "none"} />
        </button>

        {/* Save to Playlist */}
        <button
          onClick={onOpenPlaylistModal}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
        >
          <ListPlus size={18} />
          <span className="text-sm font-medium hidden sm:inline">Save</span>
        </button>

        {/* Share */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200">
          <Share2 size={18} />
          <span className="text-sm font-medium hidden sm:inline">Share</span>
        </button>

        {/* More */}
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};

export default VideoActions;

