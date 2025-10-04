// Imported all required packages
const jwt = require("jsonwebtoken");

// Function for generating a token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Function to verify a token
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

// Function for generating refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

// Exported token generation and verifying functions
module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken
}