// Imported all the required packages
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const { getProfile, getPublicProfile, updateProfile } = require("../controllers/profileController");

const upload = multer({ storage: multer.memoryStorage() });

// Routes for fetching and updating the profile
router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, upload.single("profilePic"), updateProfile);
router.get("/:username", getPublicProfile);

// Exported the router
module.exports = router;