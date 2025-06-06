const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const path = require("path");
require("dotenv\config");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const shareRoutes = require("./routes/share");
const donateRoutes = require("./routes/donate");

const app = express();

mongoose.connect(process.env.MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(session({ secret: "wot-secret", resave: false, saveUninitialized: true }));

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/share", shareRoutes);
app.use("/donate", donateRoutes);

app.use(express.static(path.join(__dirname, "../frontend")));
app.get("*", (_, res) => res.sendFile(path.join(__dirname, "../frontend/index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api/share', shareRoutes);
