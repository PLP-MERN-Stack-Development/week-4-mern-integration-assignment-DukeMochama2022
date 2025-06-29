const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const {
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
  getCategoryById,
} = require("../controller/categoryController");
const router = express.Router();

//POST api/categories
router.post("/create", authenticateToken, createCategory);

//GET api/categories
router.get("/", getAllCategories);

//DELETE api/categories
router.delete("/delete/:id", authenticateToken, deleteCategory);

//PUT api/categories
router.put("/update/:id", authenticateToken, updateCategory);

router.get("/:id", getCategoryById);

module.exports = router;
