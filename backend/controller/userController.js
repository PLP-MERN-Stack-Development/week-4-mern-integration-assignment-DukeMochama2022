const User = require("../models/User");
const { NotFoundError } = require("../utils/errors");

const getUserData = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found!");
  }

  res.json({
    success: true,
    userData: {
      name: user.name,
      isAccountVerified: user.isAccountVerified,
    },
  });
};

module.exports = getUserData;
