const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/authentication`);
    console.log("database connected successifully!");
  } catch (error) {
    console.error("Mongo Error: ", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
