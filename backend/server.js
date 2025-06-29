const express = require("express");
const cors = require("cors");
require("express-async-errors");
const path = require("path");

const cookieParser = require("cookie-parser");
const connectDB = require("./config/mongodb");
const { router } = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const commentRoutes = require("./routes/commentRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const notFoundMiddleware = require("./middleware/notFoundMiddleware");

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);

PORT = process.env.PORT || 4000;
connectDB();

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", router);
app.use("/api/user", userRouter);

app.use("/uploads", express.static("uploads"));

//API endpoints
app.get("/", (req, res) => {
  res.send(" Blog Api working  🚀.");
});

// 404 handler - must be after all routes
app.use(notFoundMiddleware);

// Error handler - must be last
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
