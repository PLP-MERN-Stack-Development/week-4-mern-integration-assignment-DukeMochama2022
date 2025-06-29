import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatRelativeTime, formatDate } from "../../utils/helpers";
import { AppContext } from "../../context/AppContext";

const PostDetail = ({ post, onDelete, deleteLoading }) => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await onDelete(post._id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Post Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={`${backendUrl}/uploads/${post.image}`}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        {post.category && (
          <div className="absolute top-4 left-4">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">
                @{post.author?.name || "Unknown"}
              </span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
              <span>•</span>
              <span>{formatRelativeTime(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Link
              to="/posts"
              className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              ← Back to Posts
            </Link>

            {/* Edit/Delete buttons for post author */}
            {userData && userData._id === post.author?._id && (
              <div className="flex items-center space-x-3">
                <Link
                  to={`/posts/${post._id}/edit`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Edit Post
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {deleteLoading && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  Delete Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
