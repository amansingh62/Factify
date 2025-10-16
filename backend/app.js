// Imported required packages
const express = require('express');
const cors = require('cors');
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

app.get('/debug/env', (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    FRONTEND_URL: process.env.FRONTEND_URL,
    isProduction: process.env.NODE_ENV === "production",
    trustProxy: app.get('trust proxy')
  });
});
// Created an authentication routes
app.use("/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes)

// Exported the app component
module.exports = app;