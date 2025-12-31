import React, { useState } from "react";

const VideoDescription = ({ videoData }) => {
  const [expandDescription, setExpandDescription] = useState(false);

  const viewCount = Number(videoData?.statistics?.viewCount || 0);
  const publishedDate = new Date(videoData?.snippet?.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const description = videoData?.snippet?.description || "";

  return (
    <div className="bg-gray-100 rounded-lg p-4 mt-4 mb-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
        <span>{viewCount.toLocaleString()} views</span>
        <span className="text-gray-500">•</span>
        <span className="text-gray-500">{publishedDate}</span>
      </div>
      <p
        className={`text-sm text-gray-900 leading-relaxed ${
          !expandDescription ? "line-clamp-2" : ""
        }`}
      >
        {description}
      </p>
      {description.length > 100 && (
        <button
          onClick={() => setExpandDescription(!expandDescription)}
          className="text-sm font-semibold text-gray-900 mt-2 hover:text-gray-600"
        >
          {expandDescription ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default VideoDescription;

