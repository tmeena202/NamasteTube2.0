import React from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import VideoCard from "./VideoCard";

const PlaylistDetail = () => {
  const { id } = useParams();
  const playlists = useSelector((store) => store.playlist.playlists || []);

  // Safe comparison: Convert both to strings to avoid type-mismatch errors
  const playlist = playlists.find((p) => String(p.id) === String(id));

  const renderSafeName = (name) => {
    if (typeof name === "object" && name !== null) return name.name;
    return name;
  };

  if (!playlist) {
    return (
      <div className="pt-32 text-center h-screen bg-white">
        <h2 className="text-2xl font-bold text-gray-800">Playlist not found</h2>
        <Link
          to="/playlists"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to all playlists
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 px-8 bg-white min-h-screen">
      <div className="flex items-end gap-6 mb-10">
        {/* Dynamic Header */}
        <div className="w-48 h-48 bg-gray-200 rounded-lg shadow-lg flex-shrink-0 overflow-hidden">
          {playlist.videos?.[0] ? (
            <img
              src={playlist.videos[0].snippet?.thumbnails?.high?.url}
              className="w-full h-full object-cover"
              alt="Playlist"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-6xl text-gray-400">
              ?
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Playlist
          </p>
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            {renderSafeName(playlist.name)}
          </h1>
          <p className="text-gray-600 font-medium">
            {playlist.videos.length} videos
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {playlist.videos.map((video) => (
          // IMPORTANT: info must be an object, but VideoCard must handle it internally
          <VideoCard key={video.id} info={video} />
        ))}
      </div>
    </div>
  );
};

export default PlaylistDetail;
