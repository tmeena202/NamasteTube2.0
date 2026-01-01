import React, { useEffect, useState } from "react";
import SideVideoCard from "./SideVideoCard";

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || "AIzaSyCKGaRs5irugjBrt41U6kI8k8bTdn5YfME";

const RelatedVideos = ({ videoData, currentVideoId }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch related videos
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchRelatedVideos = async () => {
      // Wait for videoData to get channel title for better related videos
      if (!videoData?.snippet) return;

      setLoading(true);
      try {
        // Use channel title to get videos from same channel (more reliable than relatedToVideoId)
        const channelTitle = videoData.snippet.channelTitle;
        const searchQuery = channelTitle;
        const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&type=video&q=${encodeURIComponent(searchQuery)}&key=${GOOGLE_API_KEY}`;
        
        const res = await fetch(url, { signal: abortController.signal });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();

        if (json.items) {
          // Filter out the current video from suggestions
          const filtered = json.items.filter(
            (item) => item.id.videoId !== currentVideoId
          );
          setRelatedVideos(filtered.slice(0, 10)); // Limit to 10 suggestions
        } else {
          setRelatedVideos([]);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching related videos", error);
          setRelatedVideos([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedVideos();
    
    return () => abortController.abort();
  }, [videoData, currentVideoId]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading suggestions...</div>;
  }

  if (relatedVideos.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-900">
        Suggested Videos
      </h3>
      {relatedVideos.map((video) => (
        <SideVideoCard key={video.id.videoId} video={video} />
      ))}
    </div>
  );
};

export default RelatedVideos;

