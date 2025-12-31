import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { YOUTUBE_VIDEO_API } from "../utils/constants";
import VideoCard, { withSponsoredLabel } from "./VideoCard";
import ButtonList from "./ButtonList";
import { saveVideos, addMoreVideos } from "../utils/videoCacheSlice";

const SponsoredVideoCard = withSponsoredLabel(VideoCard);

const VideoContainer = () => {
  const dispatch = useDispatch();
  const observerRef = useRef(null);

  // Redux cache
  const cachedVideos = useSelector((s) => s.videoCache.videos);
  const cachedNextPageToken = useSelector((s) => s.videoCache.nextPageToken);

  // Local UI state
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState("");
  const [loading, setLoading] = useState(false);

  // Load from cache OR API
  useEffect(() => {
    if (cachedVideos.length > 0) {
      setVideos(cachedVideos);
      setFilteredVideos(cachedVideos);
      setNextPageToken(cachedNextPageToken);
    } else {
      fetchVideos();
    }
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && nextPageToken) {
          fetchVideos();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading, nextPageToken]);

  const fetchVideos = async () => {
    setLoading(true);

    try {
      const url = nextPageToken
        ? `${YOUTUBE_VIDEO_API}&pageToken=${nextPageToken}`
        : YOUTUBE_VIDEO_API;

      const res = await fetch(url);
      const json = await res.json();

      if (!json.items) return;

      const newVideos = json.items.map((v) => ({
        ...v,
        id: v.id?.videoId || v.id,
      }));

      // 🔥 ALWAYS DISPATCH
      if (cachedVideos.length === 0) {
        dispatch(
          saveVideos({
            videos: newVideos,
            nextPageToken: json.nextPageToken || "",
          })
        );
      } else {
        dispatch(
          addMoreVideos({
            videos: newVideos,
            nextPageToken: json.nextPageToken || "",
          })
        );
      }

      setVideos((prev) => [...prev, ...newVideos]);
      setFilteredVideos((prev) => [...prev, ...newVideos]);
      setNextPageToken(json.nextPageToken || "");
    } catch (e) {
      console.error("API error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    if (category.id === "all") {
      setFilteredVideos(videos);
      return;
    }

    setFilteredVideos(
      videos.filter(
        (v) => String(v.snippet?.categoryId) === String(category.id)
      )
    );
  };

  return (
    <div className="pt-14 w-full overflow-x-hidden">
      <ButtonList onCategoryChange={handleCategoryChange} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 py-6 w-full max-w-full">
        {filteredVideos.map((video, index) => (
          <Link key={video.id} to={"/watch?v=" + video.id}>
            {index === 0 ? (
              <SponsoredVideoCard info={video} />
            ) : (
              <VideoCard info={video} />
            )}
          </Link>
        ))}
      </div>

      <div ref={observerRef} className="h-10"></div>

      {loading && (
        <p className="text-center text-gray-500">Loading more videos...</p>
      )}
    </div>
  );
};

export default VideoContainer;
