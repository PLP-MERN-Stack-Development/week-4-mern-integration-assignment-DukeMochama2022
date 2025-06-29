const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AuthenticationError } = require("../utils/errors");

const authenticateToken = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new AuthenticationError("Not authorized, please login again!");
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecode.id) {
      throw new AuthenticationError("Not authorized, please login again!");
    }

    // Get user data and set it to req.user
    const user = await User.findById(tokenDecode.id).select("-password");
    if (!user) {
      throw new AuthenticationError("User not found!");
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw new AuthenticationError(
        "Invalid or expired token, please login again!"
      );
    }
    throw error;
  }
};

module.exports = { authenticateToken };
