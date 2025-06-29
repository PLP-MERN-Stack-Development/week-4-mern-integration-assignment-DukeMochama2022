import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { getCommentsByPost } from "../../services/commentService";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import Pagination from "../posts/Pagination";

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalComments: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });
  const [showReplyForm, setShowReplyForm] = useState(null);
  const { userData } = useContext(AppContext);

  const fetchComments = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCommentsByPost(postId, { page, limit: 10 });

      if (response.success) {
        setComments(response.comments);
        setPagination(response.pagination);
      } else {
        setError(response.message);
        toast.error(response.message);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentAdded = (newComment) => {
    // Refresh comments to show the new comment
    fetchComments(1);
    setShowReplyForm(null);
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
  };

  const handleCommentDeleted = (commentId) => {
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    // Refresh to update pagination
    fetchComments(pagination.currentPage);
  };

  const handleReply = (commentId) => {
    setShowReplyForm(commentId);
  };

  const handlePageChange = (page) => {
    fetchComments(page);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Comments ({pagination.totalComments})
        </h3>
      </div>

      {/* Comment Form */}
      {userData ? (
        <div className="mb-6">
          <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            Please{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              login
            </a>{" "}
            to leave a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchComments()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id}>
                <CommentItem
                  comment={comment}
                  onCommentUpdated={handleCommentUpdated}
                  onCommentDeleted={handleCommentDeleted}
                  onReply={handleReply}
                />

                {/* Reply Form */}
                {showReplyForm === comment._id && (
                  <div className="ml-8 mt-4">
                    <CommentForm
                      postId={postId}
                      parentCommentId={comment._id}
                      onCommentAdded={handleCommentAdded}
                      onCancel={() => setShowReplyForm(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}

      {/* Loading overlay for pagination */}
      {loading && comments.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span>Loading comments...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
 