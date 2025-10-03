// Imported all required packages
const jwt = require("jsonwebtoken");

// Function for generating a token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, username: user.username, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Function to verify a token
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

// Exported token generation and verifying functions
module.exports = {
  generateToken,
  verifyToken
}