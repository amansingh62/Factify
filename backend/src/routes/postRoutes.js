// Imported all required packages
const express = require("express");
const { createPost, getAllPosts, upvotePost, flagPost, addComment, deletePost } = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Route for post media uploads
router.post("/", authMiddleware, upload.fields([
    { name: "image", maxCount: 3},
    { name: "video", maxCount: 1}
]), createPost);

// Route for upvote, flag, comment and delete
router.get("/", authMiddleware, getAllPosts);
router.put("/:id/upvote", authMiddleware, upvotePost);
router.put("/:id/flag", authMiddleware, flagPost);
router.post("/:id/comment", authMiddleware, addComment);
router.delete("/:id", authMiddleware, deletePost);

// Exported the postroute route
module.exports = router;