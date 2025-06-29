import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePosts } from "../hooks/usePosts";
import PostCard from "../components/posts/PostCard";
import SearchAndFilter from "../components/posts/SearchAndFilter";
import Pagination from "../components/posts/Pagination";
import NavBar from "../components/NavBar";

const Posts = () => {
  const {
    posts,
    loading,
    error,
    pagination,
    filters,
    fetchPosts,
    changePage,
    updateFilters,
    clearFilters,
  } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading && posts.length === 0) {
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

  if (error && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Error Loading Posts
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchPosts()}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Try Again
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">All Posts</h1>
            <p className="text-gray-600">
              Discover amazing stories and insights
            </p>
          </div>
          <Link
            to="/posts/create"
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-medium whitespace-nowrap"
          >
            Create Post
          </Link>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter
          filters={filters}
          onUpdateFilters={updateFilters}
          onClearFilters={clearFilters}
        />

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {filters.search || filters.category
                ? "No Posts Found"
                : "No Posts Yet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {filters.search || filters.category
                ? "Try adjusting your search or filters"
                : "Be the first to create a post!"}
            </p>
            {!filters.search && !filters.category && (
              <Link
                to="/posts/create"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination pagination={pagination} onPageChange={changePage} />
          </>
        )}

        {/* Loading overlay for pagination/filter changes */}
        {loading && posts.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span>Loading posts...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
