import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePosts } from "../hooks/usePosts";
import PostDetail from "../components/posts/PostDetail";
import CommentsSection from "../components/comments/CommentsSection";
import NavBar from "../components/NavBar";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPost, removePost, loading } = usePosts();
  const [post, setPost] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadPost = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    const postData = await fetchPost(id);
    if (postData) {
      setPost(postData);
    } else {
      navigate("/posts");
    }
    setIsLoading(false);
  }, [id, fetchPost, navigate]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleDelete = useCallback(
    async (postId) => {
      setDeleteLoading(true);
      const success = await removePost(postId);
      if (success) {
        navigate("/posts");
      }
      setDeleteLoading(false);
    },
    [removePost, navigate]
  );

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Post Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The post you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/posts")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Back to Posts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <PostDetail
          post={post}
          onDelete={handleDelete}
          deleteLoading={deleteLoading}
        />

        {/* Comments Section */}
        <CommentsSection postId={post._id} />
      </div>
    </div>
  );
};

export default PostDetailPage;
