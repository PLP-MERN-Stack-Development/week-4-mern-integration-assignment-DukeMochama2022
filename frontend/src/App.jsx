import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import PostDetailPage from "./pages/PostDetail";
import EditPost from "./pages/EditPost";
import CategoryManagement from "./pages/CategoryManagement";
import { ToastContainer } from "react-toastify";
import AppContextProvider from "./context/AppContext";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <AppContextProvider>
      <div>
        <ToastContainer />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/create" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/posts/:id/edit" element={<EditPost />} />
            <Route path="/categories" element={<CategoryManagement />} />
          </Routes>
        </Router>
      </div>
    </AppContextProvider>
  );
};

export default App;
