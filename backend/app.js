// Imported required packages
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./src/routes/authRoutes');
const cookieParser = require('cookie-parser');
const postRoutes = require('./src/routes/postRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const app = express();

// In production behind a proxy (e.g., Render), trust proxy so Secure cookies work
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

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
app.use("/api/profile", profileRoutes)

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all handler: send back React's index.html file for any non-API routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Exported the app component
module.exports = app;