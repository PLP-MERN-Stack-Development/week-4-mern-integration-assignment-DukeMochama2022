const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { authenticateToken } = require("../middleware/auth");
const {
  postValidationRules,
  validatePost,
} = require("../validations/postValidation");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controller/postController");

//POST api/posts
router.post(
  "/create",
  authenticateToken,
  upload.single("image"),
  postValidationRules,
  validatePost,
  createPost
);

//GET api/posts
router.get("/", getAllPosts);
// Get api/posts/id
router.get("/:id", getPostById);

//PUT api/posts/:id
router.put(
  "/update/:id",
  authenticateToken,
  upload.single("image"),
  postValidationRules,
  validatePost,
  updatePost
);

//DELETE api/posts/:id
router.delete("/delete/:id", authenticateToken, deletePost);

module.exports = router;
