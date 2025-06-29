const Post = require("../models/Post");
const {
  ValidationError,
  AuthenticationError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

//create a new post
const createPost = async (req, res) => {
  const { title, content, category } = req.body;
  const image = req.file ? req.file.filename : null;
  const author = req.user._id; // Get author from authenticated user

  if (!image) {
    throw new ValidationError("Image is required!");
  }

  const post = await Post.create({
    title,
    content,
    category,
    author,
    image,
  });

  // Populate category and author for response
  await post.populate("category", "name");
  await post.populate("author", "name");

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post,
  });
};

//view all posts with pagination, search, and filtering
const getAllPosts = async (req, res) => {
  const {
    page = 1,
    limit = 6,
    search = "",
    category = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  try {
    // Build query
    let query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Get total count for pagination
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / parseInt(limit));

    // Get posts with pagination
    const posts = await Post.find(query)
      .populate("category", "name")
      .populate("author", "name")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPosts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
    });
  }
};

// Get a specific post by ID
const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("category", "name")
    .populate("author", "name");

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  res.status(200).json({ success: true, post });
};

//update an existing post
const updatePost = async (req, res) => {
  const { title, content, category } = req.body;
  let updateData = { title, content, category };

  //if new image is uploaded, update the image field
  if (req.file) {
    updateData.image = req.file.filename;
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new NotFoundError("Post not found!");
  }

  // Check if user owns the post
  if (post.author.toString() !== req.user._id.toString()) {
    throw new AuthenticationError("You can only edit your own posts!");
  }

  const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("category", "name")
    .populate("author", "name");

  res.status(200).json({ success: true, post: updatedPost });
};

const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new NotFoundError("Post not found!");
  }

  // Check if user owns the post
  if (post.author.toString() !== req.user._id.toString()) {
    throw new AuthenticationError("You can only delete your own posts!");
  }

  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
