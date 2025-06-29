const express = require("express");
const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  getCommentReplies,
} = require("../controller/commentController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/post/:postId", getCommentsByPost);
router.get("/:commentId/replies", getCommentReplies);

// Protected routes (require authentication)
router.post("/create", authenticateToken, createComment);
router.put("/:commentId", authenticateToken, updateComment);
router.delete("/:commentId", authenticateToken, deleteComment);

module.exports = router;
 