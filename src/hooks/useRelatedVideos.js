import { useEffect, useState } from "react";

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY || "AIzaSyCKGaRs5irugjBrt41U6kI8k8bTdn5YfME";

const useRelatedVideos = (videoId) => {
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    if (!videoId) return;

    const abortController = new AbortController();

    const fetchRelatedVideos = async () => {
      try {
        const url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&relatedToVideoId=${videoId}&type=video&key=${GOOGLE_API_KEY}`;
        const res = await fetch(url, { signal: abortController.signal });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setRelatedVideos(data.items || []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Error fetching related videos", err);
        }
      }
    };

    fetchRelatedVideos();
    
    return () => abortController.abort();
  }, [videoId]);

  return relatedVideos;
};

export default useRelatedVideos;
