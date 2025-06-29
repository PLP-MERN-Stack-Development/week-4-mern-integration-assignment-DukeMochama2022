const Comment = require("../models/Comment");
const Post = require("../models/Post");
const {
  ValidationError,
  AuthenticationError,
  NotFoundError,
} = require("../utils/errors");

// Create a new comment
const createComment = async (req, res) => {
  const { content, postId, parentCommentId } = req.body;
  const userId = req.user._id;

  if (!content || !content.trim()) {
    throw new ValidationError("Comment content is required!");
  }

  if (!postId) {
    throw new ValidationError("Post ID is required!");
  }

  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new NotFoundError("Post not found!");
  }

  // Check if parent comment exists (for replies)
  if (parentCommentId) {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      throw new NotFoundError("Parent comment not found!");
    }
  }

  const comment = await Comment.create({
    content: content.trim(),
    post: postId,
    author: userId,
    parentComment: parentCommentId || null,
  });

  // Populate author info
  await comment.populate("author", "name");

  res.status(201).json({
    success: true,
    message: "Comment created successfully",
    comment,
  });
};

// Get comments for a post
const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Check if post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new NotFoundError("Post not found!");
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get top-level comments (no parent)
  const comments = await Comment.find({ post: postId, parentComment: null })
    .populate("author", "name")
    .populate({
      path: "replies",
      populate: { path: "author", select: "name" },
      options: { sort: { createdAt: 1 } },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const totalComments = await Comment.countDocuments({
    post: postId,
    parentComment: null,
  });

  const totalPages = Math.ceil(totalComments / parseInt(limit));

  res.status(200).json({
    success: true,
    comments,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalComments,
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1,
      limit: parseInt(limit),
    },
  });
};

// Update a comment
const updateComment = async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!content || !content.trim()) {
    throw new ValidationError("Comment content is required!");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found!");
  }

  // Check if user owns the comment
  if (comment.author.toString() !== userId.toString()) {
    throw new AuthenticationError("You can only edit your own comments!");
  }

  comment.content = content.trim();
  comment.isEdited = true;
  await comment.save();

  await comment.populate("author", "name");

  res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    comment,
  });
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found!");
  }

  // Check if user owns the comment
  if (comment.author.toString() !== userId.toString()) {
    throw new AuthenticationError("You can only delete your own comments!");
  }

  // Delete the comment and all its replies
  await Comment.deleteMany({
    $or: [{ _id: commentId }, { parentComment: commentId }],
  });

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
};

// Get replies for a comment
const getCommentReplies = async (req, res) => {
  const { commentId } = req.params;
  const { page = 1, limit = 5 } = req.query;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found!");
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const replies = await Comment.find({ parentComment: commentId })
    .populate("author", "name")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalReplies = await Comment.countDocuments({
    parentComment: commentId,
  });
  const totalPages = Math.ceil(totalReplies / parseInt(limit));

  res.status(200).json({
    success: true,
    replies,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalReplies,
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1,
      limit: parseInt(limit),
    },
  });
};

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  getCommentReplies,
};
 