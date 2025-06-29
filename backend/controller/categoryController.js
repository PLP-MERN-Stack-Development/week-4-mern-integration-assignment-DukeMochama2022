const Category = require("../models/Category");
const {
  ValidationError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ValidationError("Category name is required!");
  }

  const existing = await Category.findOne({ name });
  if (existing) {
    throw new ConflictError("Category already exists!");
  }

  const category = await Category.create({ name, description });
  res.status(201).json({ success: true, category });
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({ success: true, categories });
};

const updateCategory = async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  if (!name || typeof name !== "string") {
    throw new ValidationError("Category name required and must be string!");
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { name, description },
    { new: true, runValidators: true }
  );

  if (!updatedCategory) {
    throw new NotFoundError("Category not found");
  }

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category: updatedCategory,
  });
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw new NotFoundError("Category not found!");
  }
  res.status(200).json({
    success: true,
    category,
  });
};

const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
};

module.exports = {
  createCategory,
  getAllCategories,
  deleteCategory,
  getCategoryById,
  updateCategory,
};
