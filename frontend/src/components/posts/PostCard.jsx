import React from "react";
import { Link } from "react-router-dom";
import { formatRelativeTime } from "../../utils/helpers";

const PostCard = ({ post }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Helper to truncate content
  const getPreview = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Post Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={`${backendUrl}/uploads/${post.image}`}
          alt={post.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {post.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {post.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {getPreview(post.content)}
        </p>

        {/* Post Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <span className="font-medium">
              @{post.author?.name || "Unknown"}
            </span>
          </div>
          <span>{formatRelativeTime(post.createdAt)}</span>
        </div>

        {/* Read More Button */}
        <div className="mt-4">
          <Link
            to={`/posts/${post._id}`}
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
