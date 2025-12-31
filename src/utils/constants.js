const GOOGLE_API_KEY = "AIzaSyCKGaRs5irugjBrt41U6kI8k8bTdn5YfME";

export const YOUTUBE_VIDEO_API =
  "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=IN&key=" +
  GOOGLE_API_KEY;

export const SUBSCRIPTION_API =
  "https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&mine=true&key=" +
  GOOGLE_API_KEY;

export const YOUTUBE_SEARCH_API =
  "http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=";

export const YOUTUBE_COMMENTS_API =
  "https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=100&key=" +
  GOOGLE_API_KEY +
  "&videoId=";

// Function to build search API URL with order and duration parameters
export const getYoutubeSearchApiUrl = (
  query,
  order = "viewCount",
  videoDuration = "any"
) => {
  let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&type=video&order=${order}&regionCode=IN&key=${GOOGLE_API_KEY}&q=${encodeURIComponent(
    query
  )}`;

  // Add videoDuration parameter if not "any"
  if (videoDuration !== "any") {
    url += `&videoDuration=${videoDuration}`;
  }

  return url;
};

export const YOUTUBE_VIDEO_DETAILS_API =
  "https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&key=" +
  GOOGLE_API_KEY +
  "&id=";

export const YOUTUBE_CATEGORIES_API =
  "https://youtube.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=IN&key=" +
  GOOGLE_API_KEY;
