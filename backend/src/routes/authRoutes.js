// Imported all the required packages
const express = require("express");
const { signup, signin, refresh, logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route for the user authentication
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/refresh", refresh);
router.post("/logout", logout);

// Route for verification the user to access the home page
router.get("/verify", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "User verified successfully",
        user: req.user,
    });
});

// Exported the router file
module.exports = router;