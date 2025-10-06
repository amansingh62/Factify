// Imported all required packages
const Post = require("../models/Post");
const imageKit = require("../utils/imagekit");

// Function for creating the post
const createPost = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { text } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    if (!text && !req.files) {
      return res.status(400).json({ success: false, message: "Post must have text or media" });
    }

    let image = "";
    let video = "";

    // Upload image (if exists)
    if (req.files?.image?.[0]) {
      try {
        const imgResult = await imageKit.upload({
          file: req.files.image[0].buffer.toString("base64"),
          fileName: req.files.image[0].originalname,
          folder: "/posts/images",
        });
        image = imgResult.url;
      } catch (uploadErr) {
        console.error("Image upload failed:", uploadErr);
      }
    }

    // Upload video (if exists)
    if (req.files?.video?.[0]) {
      try {
        const vdoResult = await imageKit.upload({
          file: req.files.video[0].buffer.toString("base64"),
          fileName: req.files.video[0].originalname,
          folder: "/posts/videos",
        });
        video = vdoResult.url;
      } catch (uploadErr) {
        console.error("Video upload failed:", uploadErr);
      }
    }

    // Save post
    const newPost = new Post({
      user: userId,
      text,
      image,
      video,
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};

// Function for getting all posts
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find({}, "text image video comments createdAt")
      .populate("user", "username email profilePic")
      .populate("comments.user", "username")
      .sort({ createdAt: -1 })
      .skip(skip) 
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      results: posts.length,
      posts,
    });
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts. Please try again later.",
    });
  }
};

// Function for voting the post
const upvotePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({ success: false, message: "Post not found" });

        const userId = req.user.id;
        if (post.upvotes.includes(userId)){
            post.upvotes.pull(userId);
        } else {
            post.upvotes.push(userId);
        }

        await post.save();
        res.json({ success: true, upvotes: post.upvotes.length });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Function for flagging the post
const flagPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({ success: false, message: "Post not found" });

        const userId = req.user.id;
        if (post.flags.includes(userId)) {
            post.flags.pull(userId)
        } else {
            post.flags.push(userId);
        }

        await post.save();
        res.json({ success: true, flags: post.flags.length });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Function for making comment on a post
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({ success: false, message: "Post not found" });

        const comment = { user: req.user.id, text };
        post.comments.push(comment);
        await post.save();

        res.json({ success: true, message: "Comment added", comments: post.comments });
    } catch (err) {
       res.status(500).json({ success: false, message: err.message });
    }
}

// Exposted all the post creation functions
module.exports = { createPost, getAllPosts,  upvotePost, flagPost, addComment };
