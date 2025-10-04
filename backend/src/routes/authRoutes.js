// Imported all the required packages
const express = require("express");
const { signup, signin, refresh, logout } = require("../controllers/authController");

const router = express.Router();

// Route for the user authentication
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/refresh", refresh);
router.post("/logout", logout);

// Exported the router file
module.exports = router;