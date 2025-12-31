import React from "react";
import { useNavigate } from "react-router-dom";

const SideVideoCard = ({ video }) => {
  const navigate = useNavigate();

  if (!video?.snippet) return null;

  const { title, channelTitle, thumbnails } = video.snippet;
  const videoId = video.id.videoId;

  return (
    <div
      onClick={() => navigate("/watch?v=" + videoId)}
      className="flex gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
    >
      <img
        src={thumbnails.medium.url}
        alt="thumbnail"
        className="w-40 h-24 rounded-lg object-cover"
      />

      <div className="flex flex-col">
        <p className="text-sm font-semibold line-clamp-2">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{channelTitle}</p>
      </div>
    </div>
  );
};

export default SideVideoCard;
