// Imported required packages
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const cookieParser = require('cookie-parser');
const postRoutes = require('./src/routes/postRoutes');

const app = express();

// Setup some middlewares for cross origin, json payloads and url-encoded payloads respectively
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Created an authentication routes
app.use("/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Exported the app component
module.exports = app;