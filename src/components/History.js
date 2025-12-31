import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearHistory } from "../utils/historySlice";
import { Link } from "react-router-dom";

const History = () => {
  const dispatch = useDispatch();
  const historyVideos = useSelector((store) => store.history.videos);

  // Empty state (like YouTube)
  if (historyVideos.length === 0) {
    return (
      <div className="pt-24 flex flex-col items-center text-gray-600">
        <h1 className="text-xl font-semibold mb-2">Watch history</h1>
        <p className="text-sm">Videos that you watch will appear here</p>
      </div>
    );
  }

  return (
    <div className="pt-20 px-6 max-w-5xl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Watch history</h1>

        <button
          onClick={() => dispatch(clearHistory())}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear all watch history
        </button>
      </div>

      {/* HISTORY LIST */}
      <div className="space-y-6">
        {historyVideos.map((video) => {
          const { snippet, statistics, id } = video;

          return (
            <Link
              key={id}
              to={`/watch?v=${id}`}
              className="flex gap-4 hover:bg-gray-50 p-2 rounded-lg"
            >
              {/* THUMBNAIL */}
              <img
                src={snippet.thumbnails.medium.url}
                alt="thumbnail"
                className="w-48 h-28 rounded-lg object-cover flex-shrink-0"
              />

              {/* VIDEO INFO */}
              <div className="flex flex-col">
                <h2 className="font-medium text-base line-clamp-2">
                  {snippet.title}
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  {snippet.channelTitle}
                </p>

                <p className="text-sm text-gray-600">
                  {statistics?.viewCount || 0} views
                </p>

                <p className="text-xs text-gray-500 mt-1">Watched recently</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default History;
