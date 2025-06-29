import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { updateComment, deleteComment } from "../../services/commentService";
import { formatDate } from "../../utils/helpers";

const CommentItem = ({
  comment,
  onCommentUpdated,
  onCommentDeleted,
  onReply,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(AppContext);

  const isAuthor = userData && comment.author._id === userData._id;

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!editContent.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const response = await updateComment(comment._id, editContent);

      if (response.success) {
        setIsEditing(false);
        toast.success("Comment updated successfully!");
        onCommentUpdated(response.comment);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await deleteComment(comment._id);

      if (response.success) {
        toast.success("Comment deleted successfully!");
        onCommentDeleted(comment._id);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete comment");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = () => {
    if (!userData) {
      toast.error("Please login to reply");
      return;
    }
    onReply(comment._id);
  };

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <div className="flex items-start gap-3">
        {/* Author Avatar */}
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 flex-shrink-0">
          {comment.author.name[0].toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {/* Comment Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-900">
              {comment.author.name}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <form onSubmit={handleEdit} className="mb-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                maxLength={1000}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !editContent.trim()}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-gray-700 mb-3 whitespace-pre-wrap">
              {comment.content}
            </div>
          )}

          {/* Comment Actions */}
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={handleReply}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Reply
            </button>

            {isAuthor && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-4 border-l-2 border-gray-200 pl-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onCommentUpdated={onCommentUpdated}
                  onCommentDeleted={onCommentDeleted}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
 