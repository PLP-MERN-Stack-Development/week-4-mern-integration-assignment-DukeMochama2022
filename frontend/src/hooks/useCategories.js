import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCategories();
      if (data.success) {
        setCategories(data.categories);
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
  }, []);

  // Create new category
  const addCategory = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createCategory(categoryData);
      if (data.success) {
        setCategories((prev) => [data.category, ...prev]);
        toast.success("Category created successfully!");
        return data.category;
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

  // Update category
  const editCategory = useCallback(async (id, categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateCategory(id, categoryData);
      if (data.success) {
        setCategories((prev) =>
          prev.map((category) =>
            category._id === id ? data.category : category
          )
        );
        toast.success("Category updated successfully!");
        return data.category;
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

  // Delete category
  const removeCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await deleteCategory(id);
      if (data.success) {
        setCategories((prev) => prev.filter((category) => category._id !== id));
        toast.success("Category deleted successfully!");
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
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
  };
};
