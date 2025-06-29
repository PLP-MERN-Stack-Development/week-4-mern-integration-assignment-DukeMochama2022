import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { usePosts } from "../hooks/usePosts";
import PostForm from "../components/posts/PostForm";
import NavBar from "../components/NavBar";
import { AppContext } from "../context/AppContext";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const { fetchPost, editPost, loading } = usePosts();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPost = useCallback(async () => {
    if (!id || !userData) return;

    setIsLoading(true);
    const postData = await fetchPost(id);
    if (postData) {
      // Check if user is the author (post.author is now populated with user object)
      if (postData.author._id !== userData._id) {
        toast.error("You can only edit your own posts");
        navigate("/posts");
        return;
      }
      setPost(postData);
    } else {
      navigate("/posts");
    }
    setIsLoading(false);
  }, [id, fetchPost, navigate, userData]);

  useEffect(() => {
    if (userData) {
      loadPost();
    }
  }, [loadPost, userData]);

  const handleSubmit = useCallback(
    async (postData) => {
      const result = await editPost(id, postData);
      if (result) {
        navigate(`/posts/${id}`);
      }
    },
    [editPost, id, navigate]
  );

  // Redirect if not logged in
  if (!userData) {
    navigate("/login");
    return null;
  }

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
              The post you're trying to edit doesn't exist.
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
        <PostForm post={post} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default EditPost;
