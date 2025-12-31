import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToHistory } from "../utils/historySlice";
import { addLikedVideo, removeLikedVideo } from "../utils/likedVideosSlice";

const VideoCard = ({ info }) => {
  const dispatch = useDispatch();
  const likedVideos = useSelector((state) => state.likedVideos);

  if (!info || !info.snippet) return null;

  const { snippet, statistics } = info;
  const { channelTitle, title, thumbnails, publishedAt } = snippet;
  //console.log(snippet);

  const isLiked = likedVideos.some((v) => v.id === info.id);

  // Format views
  const formatViews = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K";
    return count;
  };

  // Calculate time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInSeconds = Math.floor((now - published) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + "m ago";
    if (diffInSeconds < 86400)
      return Math.floor(diffInSeconds / 3600) + "h ago";
    if (diffInSeconds < 2592000)
      return Math.floor(diffInSeconds / 86400) + "d ago";
    if (diffInSeconds < 31536000)
      return Math.floor(diffInSeconds / 2592000) + "mo ago";
    return Math.floor(diffInSeconds / 31536000) + "y ago";
  };

  // Save video to history
  const handleClick = () => {
    dispatch(addToHistory(info));
  };

  // Like/unlike video
  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (isLiked) dispatch(removeLikedVideo(info));
    else dispatch(addLikedVideo(info));
  };

  return (
    <div className="cursor-pointer" onClick={handleClick}>
      {/* Thumbnail */}
      <div className="relative w-full">
        <img
          className="rounded-md w-full aspect-video object-cover"
          alt="video thumbnail"
          src={thumbnails.standard.url}
        />

        {/* Like button */}
        <button
          onClick={handleLikeClick}
          className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[10px] rounded ${
            isLiked ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {isLiked ? "Liked" : "Like"}
        </button>
      </div>

      {/* Info */}
      <div className="flex gap-2 mt-2">
        {/* Channel avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-semibold text-gray-600">
            {channelTitle?.charAt(0)?.toUpperCase() || "C"}
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-xs line-clamp-2 text-gray-900 leading-snug">
            {title}
          </h3>
          <p className="text-[11px] text-gray-600 leading-tight">
            {channelTitle}
          </p>
          <p className="text-[11px] text-gray-600">
            {formatViews(statistics?.viewCount || 0)} views •{" "}
            {getTimeAgo(publishedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

/* HOC for sponsored label */
export const withSponsoredLabel = (VideoCard) => {
  return ({ info }) => {
    if (!info) return null;

    return (
      <div className="relative">
        <span className="absolute top-1.5 left-1.5 bg-yellow-400 text-black text-[10px] px-1.5 py-0.5 rounded z-10 font-medium">
          Sponsored
        </span>
        <VideoCard info={info} />
      </div>
    );
  };
};

export default VideoCard;
