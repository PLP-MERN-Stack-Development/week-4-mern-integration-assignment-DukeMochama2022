import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryCard from "../components/categories/CategoryCard";
import NavBar from "../components/NavBar";
import { AppContext } from "../context/AppContext";

const CategoryManagement = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
  } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Redirect if not logged in (you might want to add admin check here)
  if (!userData) {
    navigate("/login");
    return null;
  }

  const handleCreateCategory = async (categoryData) => {
    const result = await addCategory(categoryData);
    if (result) {
      setShowForm(false);
    }
  };

  const handleEditCategory = async (categoryData) => {
    const result = await editCategory(editingCategory._id, categoryData);
    if (result) {
      setEditingCategory(null);
      setShowForm(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    setDeleteLoading(true);
    const success = await removeCategory(categoryId);
    setDeleteLoading(false);
    return success;
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  if (loading && categories.length === 0) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Category Management
            </h1>
            <p className="text-gray-600">
              Manage blog categories and organize your content
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-medium whitespace-nowrap"
          >
            Add Category
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Category Form */}
        {showForm && (
          <div className="mb-8">
            <CategoryForm
              category={editingCategory}
              onSubmit={
                editingCategory ? handleEditCategory : handleCreateCategory
              }
              onCancel={handleCancelForm}
              loading={loading}
            />
          </div>
        )}

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Categories Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first category to get started!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Create Your First Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                onEdit={handleEditClick}
                onDelete={handleDeleteCategory}
                deleteLoading={deleteLoading}
              />
            ))}
          </div>
        )}

        {/* Loading overlay for delete operations */}
        {deleteLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span>Deleting category...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
