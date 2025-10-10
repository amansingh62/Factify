// Imported all the required packages
const User = require("../models/User");
const Post = require("../models/Post");
const imagekit = require("../utils/imagekit");

// Function for fetching all the posts and length of the current user
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshToken");
    const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({
      user,
      stats: { totalPosts: posts.length },
      posts
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

// Function for fetching a public profile by username
const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username?.toLowerCase() })
      .select("-password -refreshToken -email -refreshToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });
    return res.json({
      user,
      stats: { totalPosts: posts.length },
      posts,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching public profile", error: err.message });
  }
};

// Function for updating the profile for the current user
const updateProfile = async (req, res) => {
  try {
    const { bio, name } = req.body;
    let updateData = { bio, name };

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `profile_${req.user.id}_${Date.now()}`,
        folder: "profiles",
      });
      updateData.profilePic = result.url;
    }

    const updated = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      select: "-password -refreshToken",
    });

    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
}

// Exported the getProfile and updateProfile functions
module.exports = { getProfile, getPublicProfile, updateProfile };