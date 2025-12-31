import { useEffect, useState } from "react";
import { YOUTUBE_COMMENTS_API } from "../utils/constants";

const getTimeAgo = (dateString) => {
  if (!dateString) return "";
  const now = new Date();
  const published = new Date(dateString);
  const diffInSeconds = Math.floor((now - published) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + "m ago";
  if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + "h ago";
  if (diffInSeconds < 2592000) return Math.floor(diffInSeconds / 86400) + "d ago";
  if (diffInSeconds < 31536000) return Math.floor(diffInSeconds / 2592000) + "mo ago";
  return Math.floor(diffInSeconds / 31536000) + "yr ago";
};

const Comment = ({ data }) => {
  const { name, text, replies, profileImage, publishedAt, likeCount } = data;

  return (
    <div className="flex gap-3 mb-6">
      <img
        src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=607d8b&color=fff&size=128`}
        alt={name}
        className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=607d8b&color=fff&size=128`;
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-sm text-gray-900">{name || "User"}</h3>
          <span className="text-xs text-gray-500">{getTimeAgo(publishedAt)}</span>
        </div>
        <div className="text-sm text-gray-900 mb-2 whitespace-pre-wrap leading-relaxed break-words">{text}</div>
        <div className="flex items-center gap-4 mb-2">
          <button className="flex items-center gap-1.5 px-1 py-0.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
            </svg>
            {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
          </button>
          <button className="transform rotate-180 flex items-center gap-1.5 px-1 py-0.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
            </svg>
          </button>
          <button className="text-xs font-medium text-gray-600 hover:text-gray-900 px-2 py-0.5 rounded-full hover:bg-gray-100">
            REPLY
          </button>
        </div>
        {replies?.length > 0 && (
          <div className="mt-4">
            {replies.map((reply) => (
              <div key={reply.id} className="mb-4">
                <Comment data={reply} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentContainer = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!videoId) return;

    const getComments = async () => {
      setLoading(true);
      try {
        const response = await fetch(YOUTUBE_COMMENTS_API + videoId);
        const data = await response.json();

        const commentsList = (data.items || []).map((item) => {
          const snippet = item.snippet.topLevelComment.snippet;
          return {
            id: item.id,
            name: snippet.authorDisplayName,
            text: snippet.textDisplay,
            profileImage: snippet.authorProfileImageUrl,
            publishedAt: snippet.publishedAt,
            likeCount: snippet.likeCount,
            replies:
              item.replies?.comments?.map((reply) => ({
                id: reply.id,
                name: reply.snippet.authorDisplayName,
                text: reply.snippet.textDisplay,
                profileImage: reply.snippet.authorProfileImageUrl,
                publishedAt: reply.snippet.publishedAt,
                likeCount: reply.snippet.likeCount,
              })) || [],
          };
        });

        setComments(commentsList);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    getComments();
  }, [videoId]);

  if (loading) {
    return (
      <div className="mt-6 text-center py-8">
        <p className="text-gray-500">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-6">{comments.length} Comments</h2>
      <div className="space-y-1">
        {comments.map((comment) => (
          <Comment key={comment.id} data={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentContainer;

