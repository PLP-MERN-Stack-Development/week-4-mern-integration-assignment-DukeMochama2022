import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Create a new comment
export const createComment = async (commentData) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/comments/create`,
      commentData
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to create comment",
      }
    );
  }
};

// Get comments for a post
export const getCommentsByPost = async (postId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const url = `${backendUrl}/api/comments/post/${postId}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch comments",
      }
    );
  }
};

// Update a comment
export const updateComment = async (commentId, content) => {
  try {
    const response = await axios.put(
      `${backendUrl}/api/comments/${commentId}`,
      { content }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to update comment",
      }
    );
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `${backendUrl}/api/comments/${commentId}`
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to delete comment",
      }
    );
  }
};

// Get replies for a comment
export const getCommentReplies = async (commentId, params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const url = `${backendUrl}/api/comments/${commentId}/replies${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch replies",
      }
    );
  }
};
 