// Imported required packages
const mongoose = require('mongoose');

// Logic for connecting database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection failed", err.message);
    process.exit(1);
  }
};

// Exported the database connection component
module.exports = connectDB;