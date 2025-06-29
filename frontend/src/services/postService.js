import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Get all posts with pagination, search, and filtering
export const getAllPosts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    // Add pagination parameters
    if (params.page) queryParams.append("page", params.page);
    queryParams.append("limit", params.limit || 6);

    // Add search and filter parameters
    if (params.search) queryParams.append("search", params.search);
    if (params.category) queryParams.append("category", params.category);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const url = `${backendUrl}/api/posts${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch posts",
      }
    );
  }
};

// Get single post by ID
export const getPostById = async (id) => {
  try {
    const response = await axios.get(`${backendUrl}/api/posts/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch post",
      }
    );
  }
};

// Create new post
export const createPost = async (postData) => {
  try {
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("category", postData.category);
    formData.append("image", postData.image);

    const response = await axios.post(
      `${backendUrl}/api/posts/create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to create post",
      }
    );
  }
};

// Update post
export const updatePost = async (id, postData) => {
  try {
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    formData.append("category", postData.category);
    if (postData.image) {
      formData.append("image", postData.image);
    }

    const response = await axios.put(
      `${backendUrl}/api/posts/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to update post",
      }
    );
  }
};

// Delete post
export const deletePost = async (id) => {
  try {
    const response = await axios.delete(`${backendUrl}/api/posts/delete/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to delete post",
      }
    );
  }
};
