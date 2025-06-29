const { NotFoundError } = require("../utils/errors");

const notFoundMiddleware = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

module.exports = notFoundMiddleware;
