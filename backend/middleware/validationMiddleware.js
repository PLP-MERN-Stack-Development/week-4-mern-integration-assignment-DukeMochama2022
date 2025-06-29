const { ValidationError } = require("../utils/errors");

// Generic validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      throw new ValidationError(errorMessage);
    }
    next();
  };
};

// Validate required fields
const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    const missingFields = [];

    fields.forEach((field) => {
      if (!req.body[field] || req.body[field].toString().trim() === "") {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      throw new ValidationError(
        `Missing required fields: ${missingFields.join(", ")}`
      );
    }

    next();
  };
};

// Validate email format
const validateEmail = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (req.body.email && !emailRegex.test(req.body.email)) {
    throw new ValidationError("Invalid email format");
  }
  next();
};

// Validate password strength
const validatePassword = (req, res, next) => {
  if (req.body.password) {
    if (req.body.password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters long");
    }
  }
  next();
};

module.exports = {
  validateRequest,
  validateRequiredFields,
  validateEmail,
  validatePassword,
};
