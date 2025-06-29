import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../hooks/usePosts";
import PostForm from "../components/posts/PostForm";
import NavBar from "../components/NavBar";
import { AppContext } from "../context/AppContext";

const CreatePost = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const { addPost, loading } = usePosts();

  // Redirect if not logged in
  if (!userData) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (postData) => {
    const result = await addPost(postData);
    if (result) {
      navigate("/posts");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <PostForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default CreatePost;
