import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../services/postService";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 6,
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch all posts with filters and pagination
  const fetchPosts = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          page: params.page || pagination.currentPage,
          limit: pagination.limit,
          search: params.search !== undefined ? params.search : filters.search,
          category:
            params.category !== undefined ? params.category : filters.category,
          sortBy: params.sortBy || filters.sortBy,
          sortOrder: params.sortOrder || filters.sortOrder,
        };

        const data = await getAllPosts(queryParams);
        if (data.success) {
          setPosts(data.posts);
          setPagination(data.pagination);

          // Update filters if new params provided
          if (
            params.search !== undefined ||
            params.category !== undefined ||
            params.sortBy ||
            params.sortOrder
          ) {
            setFilters({
              search: queryParams.search,
              category: queryParams.category,
              sortBy: queryParams.sortBy,
              sortOrder: queryParams.sortOrder,
            });
          }
        } else {
          setError(data.message);
          toast.error(data.message);
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    },
    [pagination.currentPage, pagination.limit, filters]
  );

  // Fetch single post
  const fetchPost = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPostById(id);
      if (data.success) {
        return data.post;
      } else {
        setError(data.message);
        toast.error(data.message);
        return null;
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new post
  const addPost = useCallback(
    async (postData) => {
      setLoading(true);
      setError(null);
      try {
        const data = await createPost(postData);
        if (data.success) {
          // Refresh posts to show the new post
          await fetchPosts({ page: 1 });
          toast.success("Post created successfully!");
          return data.post;
        } else {
          setError(data.message);
          toast.error(data.message);
          return null;
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchPosts]
  );

  // Update post
  const editPost = useCallback(async (id, postData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updatePost(id, postData);
      if (data.success) {
        setPosts((prev) =>
          prev.map((post) => (post._id === id ? data.post : post))
        );
        toast.success("Post updated successfully!");
        return data.post;
      } else {
        setError(data.message);
        toast.error(data.message);
        return null;
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete post
  const removePost = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const data = await deletePost(id);
        if (data.success) {
          // Refresh posts to update pagination
          await fetchPosts();
          toast.success("Post deleted successfully!");
          return true;
        } else {
          setError(data.message);
          toast.error(data.message);
          return false;
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchPosts]
  );

  // Change page
  const changePage = useCallback(
    (page) => {
      fetchPosts({ page });
    },
    [fetchPosts]
  );

  // Update filters
  const updateFilters = useCallback(
    (newFilters) => {
      fetchPosts({ ...newFilters, page: 1 });
    },
    [fetchPosts]
  );

  // Clear filters
  const clearFilters = useCallback(() => {
    const defaultFilters = {
      search: "",
      category: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(defaultFilters);
    fetchPosts({ ...defaultFilters, page: 1 });
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    pagination,
    filters,
    fetchPosts,
    fetchPost,
    addPost,
    editPost,
    removePost,
    changePage,
    updateFilters,
    clearFilters,
  };
};
