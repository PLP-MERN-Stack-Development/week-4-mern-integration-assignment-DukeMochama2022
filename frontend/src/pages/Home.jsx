import React, { useContext, useState } from "react";
import NavBar from "../components/NavBar";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import homeImage from "../assets/Home-page.jpg";
import Blog from "../assets/Blogs.jpg"

const Home = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setIsLoggedin, getUserData } =
    useContext(AppContext);
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          toast.success(data.message);
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          return toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });
        if (data.success) {
          toast.success(data.message);
          setIsLoggedin(true);
          getUserData();
          navigate("/");
        } else {
          return toast.error(data.message);
        }
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <div className="flex flex-1 flex-col md:flex-row items-stretch justify-center mt-16">
        {/* Left: Image */}
        <div className="md:w-1/2 w-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-200">
          <img
            src={Blog}
            alt="Welcome"
            className="object-cover mx-5 w-full h-96 md:h-full md:w-auto rounded-none md:rounded-r-3xl shadow-xl"
            style={{ maxHeight: "600px" }}
          />
        </div>
        {/* Right: Content */}
        <div className="md:w-1/2 w-full flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
              Welcome to Your Blog Platform!
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              This is a modern, full-featured blog platform where you can
              create, edit, and manage posts, organize categories, and interact
              with comments. Enjoy a seamless, responsive experience with
              authentication, image uploads, and more!
            </p>
            {!userData ? (
              <div className="bg-gray-100 rounded-xl shadow p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2 text-center">
                  {state === "Sign Up" ? "Create Account" : "Login"}
                </h2>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  {state === "Sign Up"
                    ? "Create your account below"
                    : "Login to your account"}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {state === "Sign Up" && (
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  )}
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <div className="flex justify-between items-center">
                    <span
                      className="text-sm text-blue-600 hover:underline cursor-pointer"
                      onClick={() => navigate("/reset-password")}
                    >
                      Forgot password?
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                  >
                    {state}
                  </button>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    {state === "Sign Up"
                      ? "Already have an account?"
                      : "Don't have Account?"}{" "}
                    <span
                      className="text-blue-600 cursor-pointer underline"
                      onClick={() =>
                        setState(state === "Sign Up" ? "Login" : "Sign Up")
                      }
                    >
                      {state === "Sign Up" ? "Login" : "Sign Up"}
                    </span>
                  </p>
                </form>
              </div>
            ) : (
              <div className="bg-green-50 rounded-xl shadow p-8 text-center">
                <h2 className="text-2xl font-semibold text-green-700 mb-2">
                  Welcome back, {userData.name}!
                </h2>
                <p className="text-gray-700 mb-4">
                  Ready to write your next post or explore the latest stories?
                </p>
                <button
                  onClick={() => navigate("/posts")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  Go to Posts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
