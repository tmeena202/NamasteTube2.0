import React from "react";
import { Link } from "react-router-dom";

const SearchResultCard = ({ video }) => {
  if (!video || !video.snippet) return null;
  
  const { snippet, statistics } = video;
  const { channelTitle, title, thumbnails, publishedAt, description } = snippet;

  // Format views
  const formatViews = (count) => {
    if (!count) return "0";
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M views";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K views";
    }
    return count + " views";
  };

  // Calculate time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInSeconds = Math.floor((now - published) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + " minutes ago";
    if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + " hours ago";
    if (diffInSeconds < 2592000) return Math.floor(diffInSeconds / 86400) + " days ago";
    if (diffInSeconds < 31536000) return Math.floor(diffInSeconds / 2592000) + " months ago";
    return Math.floor(diffInSeconds / 31536000) + " years ago";
  };

  // Truncate description
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Link to={"/watch?v=" + video.id} className="block">
      <div className="flex flex-col sm:flex-row gap-3 mb-8 cursor-pointer">
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-full sm:w-[360px]">
          <div className="relative w-full aspect-video sm:w-[360px] sm:h-[202px]">
            <img
              className="w-full h-full rounded-lg object-cover"
              alt="video thumbnail"
              src={thumbnails.medium?.url || thumbnails.default?.url}
            />
          </div>
        </div>

        {/* Video Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 line-clamp-2 leading-5 sm:leading-6">
            {title}
          </h3>
          
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 mb-2">
            <span>{formatViews(statistics?.viewCount || 0)}</span>
            <span>•</span>
            <span>{getTimeAgo(publishedAt)}</span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-gray-600">
                {channelTitle?.charAt(0)?.toUpperCase() || "C"}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-600 hover:text-gray-900">{channelTitle}</span>
          </div>

          {description && (
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 hidden sm:block">
              {truncateDescription(description, 120)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;

