// Imported all the required packages
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const { getProfile, updateProfile } = require("../controllers/profileController");

const upload = multer({ storage: multer.memoryStorage() });

// Routes for fetching and updating the profile
router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, upload.single("profilePic"), updateProfile);

// Exported the router
module.exports = router;