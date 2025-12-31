import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Playlists = () => {
  const playlists = useSelector((store) => store.playlist.playlists);

  // Helper function to safely render names even if they are objects
  const renderSafeName = (name) => {
    if (typeof name === "object" && name !== null) {
      return name.name || "Untitled Playlist"; // Extracts name property if it's an object
    }
    return name || "Untitled Playlist";
  };

  if (!playlists || playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-500">
          No playlists available
        </h2>
        <p className="text-gray-400 mt-2">
          Start by creating your first playlist!
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 pt-24 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Library</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <Link
            to={`/playlist/${playlist.id}`}
            key={playlist.id}
            className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100"
          >
            {/* Playlist Cover Mockup */}
            <div className="aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center text-white overflow-hidden">
              {playlist.videos?.[0]?.snippet?.thumbnails?.medium?.url ? (
                <img
                  src={playlist.videos[0].snippet.thumbnails.medium.url}
                  alt="Cover"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <span className="text-4xl font-bold opacity-50">♪</span>
              )}
            </div>

            <h3 className="font-bold text-gray-900 truncate">
              {renderSafeName(playlist.name)}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {playlist.videos?.length || 0} videos
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Playlists;
