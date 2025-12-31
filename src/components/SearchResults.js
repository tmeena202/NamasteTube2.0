import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getYoutubeSearchApiUrl, YOUTUBE_VIDEO_DETAILS_API } from "../utils/constants";
import SearchResultCard from "./SearchResultCard";
import SearchFilters from "./SearchFilters";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("search_query");
  const order = searchParams.get("order") || "viewCount";
  const videoDuration = searchParams.get("videoDuration") || "any";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle filter changes
  const handleOrderChange = (newOrder) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("order", newOrder);
    setSearchParams(newParams);
  };

  const handleDurationChange = (newDuration) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("videoDuration", newDuration);
    setSearchParams(newParams);
  };

  useEffect(() => {
    const getSearchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(getYoutubeSearchApiUrl(query, order, videoDuration));
        const json = await response.json();

        if (json.items) {
          // Fetch additional video details (statistics) for each video
          const videoIds = json.items.map((item) => item.id.videoId).join(",");
          const videoDetailsResponse = await fetch(
            YOUTUBE_VIDEO_DETAILS_API + videoIds
          );
          const videoDetailsJson = await videoDetailsResponse.json();
          setVideos(videoDetailsJson.items || []);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    getSearchResults();
  }, [query, order, videoDuration]);

  if (loading) {
    return (
      <div className="pt-20 px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-lg text-gray-600">Loading search results...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 pb-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h2 className="text-xl font-semibold">
            {query ? `Search Results for "${query}"` : "Search Results"}
          </h2>
          <SearchFilters
            order={order}
            videoDuration={videoDuration}
            onOrderChange={handleOrderChange}
            onDurationChange={handleDurationChange}
          />
        </div>

        {videos.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-lg text-gray-600 mb-2">No results found</p>
              <p className="text-sm text-gray-500">Try searching for something else</p>
            </div>
          </div>
        ) : (
          <div>
            {videos.map((video) => (
              <SearchResultCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

