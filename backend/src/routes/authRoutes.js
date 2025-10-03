// Imported all the required packages
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateToken } = require("../utils/jwtHelper");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route function for sign up
router.post("/signup", async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "user already exists"});

        const hash = await bcrypt.hash(password, 10);
        const newUser =  await User.create({ name, username, email, password: hash });
        
        res.json({ token: generateToken(newUser),
            user: { id: newUser._id, name: newUser.name, username: newUser.username, email: newUser.email }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route function for login
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.json({ token: generateToken(user), 
            user: { id: user._id, name: user.name, username: user.username, email: user.email }
         });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } 
});

// Route to verify token
router.get("/verify", authMiddleware, (req, res) => {
    res.json({ valid: true, user: req.user });
});

// Exported the router file
module.exports = router;