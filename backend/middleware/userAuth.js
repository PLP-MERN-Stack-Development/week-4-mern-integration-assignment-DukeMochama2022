const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("../utils/errors");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new AuthenticationError("Not authorized, please login again!");
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.body = { userId: tokenDecode.id };
    } else {
      throw new AuthenticationError("Not authorized, please login again!");
    }
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

module.exports = userAuth;
