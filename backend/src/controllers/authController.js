// Imported all the required packages
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateToken, generateRefreshToken } = require("../utils/jwtHelper");

// Function for Signup
const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check if email or username already exists
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists)
      return res.status(400).json({ message: "Email or Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Generate tokens
    const accessToken = generateToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Save refresh token in DB
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Set cookies
    const isProduction = process.env.NODE_ENV === "production";
    const cookieBase = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieBase,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieBase,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send response with user info and tokens
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function for Signin
const signin = async (req, res) => {
  try {
    console.log("🔍 Environment check:");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
    console.log("Cookie will be secure:", process.env.NODE_ENV === "production");
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // Generate tokens
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    const isProduction = process.env.NODE_ENV === "production";
    const cookieBase = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieBase,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieBase,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send response with user info and tokens
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Function for Refresh Token
const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateToken(user);

    const isProduction = process.env.NODE_ENV === "production";
    const cookieBase = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };
    res.cookie("accessToken", newAccessToken, {
      ...cookieBase,
      maxAge: 15 * 60 * 1000,
    });

    res.json({
      message: "Token refreshed",
      tokens: { accessToken: newAccessToken }
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// Function for Logout
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.decode(refreshToken);
      if (decoded?.id) {
        await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
      }
    }

    const isProduction = process.env.NODE_ENV === "production";
    const clearOpts = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };
    res.clearCookie("accessToken", clearOpts);
    res.clearCookie("refreshToken", clearOpts);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Exported all the route logics
module.exports = {
  signup,
  signin,
  refresh,
  logout,
};
