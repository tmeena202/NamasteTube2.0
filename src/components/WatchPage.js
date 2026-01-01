import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeMenu } from "../utils/appSlice.js";
import { useSearchParams } from "react-router-dom";
import CommentContainer from "./CommentContainer";
import LiveChat from "./LiveChat.js";
import VideoActions from "./VideoActions";
import VideoDescription from "./VideoDescription";
import PlaylistModal from "./PlaylistModal";
import SideVideoCard from "./SideVideoCard";

// ⚠️ Note: If "Video not found" persists, this API Key might be over quota.
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || "AIzaSyCKGaRs5irugjBrt41U6kI8k8bTdn5YfME";

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const dispatch = useDispatch();

  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loadingRelatedVideos, setLoadingRelatedVideos] = useState(false);

  // Close sidebar menu on load
  useEffect(() => {
    dispatch(closeMenu());
  }, [dispatch]);

  // Fetch video details
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchVideoData = async () => {
      if (!videoId) return;
      setLoading(true);
      try {
        const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${GOOGLE_API_KEY}`;
        const res = await fetch(url, { signal: abortController.signal });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();

        if (json.items && json.items.length > 0) {
          setVideoData(json.items[0]);
        } else {
          console.error("Video not found. API Error or Invalid ID.");
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching video data", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
    
    return () => abortController.abort();
  }, [videoId]);

  // Fetch related videos
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchRelatedVideos = async () => {
      if (!videoId) return; // Use videoId directly instead of waiting for videoData

      setLoadingRelatedVideos(true);
      try {
        // Use YouTube's relatedToVideoId parameter for better related videos
        const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&type=video&relatedToVideoId=${videoId}&key=${GOOGLE_API_KEY}`;
        
        const res = await fetch(url, { signal: abortController.signal });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const json = await res.json();

        if (json.items) {
          // Filter out the current video from suggestions
          const filtered = json.items.filter(
            (item) => item.id.videoId !== videoId
          );
          setRelatedVideos(filtered.slice(0, 10)); // Limit to 10 suggestions
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching related videos", error);
          setRelatedVideos([]);
        }
      } finally {
        setLoadingRelatedVideos(false);
      }
    };

    fetchRelatedVideos();
    
    return () => abortController.abort();
  }, [videoId]);

  if (loading) return <div className="pt-20 px-4">Loading video...</div>;
  if (!videoData)
    return (
      <div className="pt-20 px-4">
        Video not found (Check Console for API error)
      </div>
    );

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl pt-20 px-4 pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Video Container */}
            <div className="w-full bg-black rounded-2xl overflow-hidden shadow-sm mb-4">
              <div className="aspect-video w-full bg-black flex items-center justify-center">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title={videoData.snippet.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Video Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
              {videoData.snippet.title}
            </h1>

            {/* Video Actions */}
            <VideoActions
              videoData={videoData}
              videoId={videoId}
              onOpenPlaylistModal={() => setShowPlaylistModal(true)}
            />

            {/* Video Description */}
            <VideoDescription videoData={videoData} />

            {/* Comments */}
            <CommentContainer videoId={videoId} />
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-96 flex flex-col gap-6">
            {/* Related Videos Suggestions */}
            {loadingRelatedVideos ? (
              <div className="text-sm text-gray-500">Loading suggestions...</div>
            ) : relatedVideos.length > 0 ? (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Suggested Videos
                </h3>
                {relatedVideos.map((video) => (
                  <SideVideoCard key={video.id.videoId} video={video} />
                ))}
              </div>
            ) : null}

            <LiveChat />
          </div>
        </div>
      </div>

      {/* Playlist Modal */}
      <PlaylistModal
        showModal={showPlaylistModal}
        setShowModal={setShowPlaylistModal}
        videoData={videoData}
      />
    </div>
  );
};

export default WatchPage;
