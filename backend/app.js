// backend/app.js
const express = require("express");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const shareRoutes = require("./routes/share");

// Init
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "wot-secret", resave: false, saveUninitialized: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/auth", authRoutes);
app.use("/api/share", shareRoutes);

// Frontend
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
