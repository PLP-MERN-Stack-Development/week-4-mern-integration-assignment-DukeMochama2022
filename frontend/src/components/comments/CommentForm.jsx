import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { createComment } from "../../services/commentService";

const CommentForm = ({
  postId,
  parentCommentId = null,
  onCommentAdded,
  onCancel,
}) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    if (!userData) {
      toast.error("Please login to comment");
      return;
    }

    setLoading(true);
    try {
      const commentData = {
        content: content.trim(),
        postId,
        parentCommentId,
      };

      const response = await createComment(commentData);

      if (response.success) {
        setContent("");
        toast.success("Comment added successfully!");
        onCommentAdded(response.comment);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              parentCommentId ? "Write a reply..." : "Write a comment..."
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            maxLength={1000}
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {content.length}/1000
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Posting...
              </div>
            ) : (
              "Post Comment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
 