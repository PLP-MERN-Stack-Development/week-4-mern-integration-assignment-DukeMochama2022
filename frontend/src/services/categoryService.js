import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/categories`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to fetch categories",
      }
    );
  }
};

// Create new category
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/categories/create`,
      categoryData
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to create category",
      }
    );
  }
};

// Update category
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(
      `${backendUrl}/api/categories/update/${id}`,
      categoryData
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to update category",
      }
    );
  }
};

// Delete category
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(
      `${backendUrl}/api/categories/delete/${id}`
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Failed to delete category",
      }
    );
  }
};
