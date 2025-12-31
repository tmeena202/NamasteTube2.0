import React from "react";
import { useSelector } from "react-redux";
import VideoCard from "./VideoCard";

const LikedVideos = () => {
  const likedVideos = useSelector((store) => store.likedVideos);

  if (!likedVideos || likedVideos.length === 0) {
    return (
      <div className="pt-14 px-4 text-center text-gray-600">
        <h2 className="text-xl font-semibold mb-2">No liked videos yet</h2>
        <p>Videos you like will appear here.</p>
      </div>
    );
  }

  return (
    <div className="pt-14 px-4">
      <h1 className="text-2xl font-semibold mb-6">Liked Videos</h1>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {likedVideos.map((video) => (
          <div
            key={video.id}
            className="hover:scale-[1.02] transition-transform duration-150"
          >
            <VideoCard info={video} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedVideos;
