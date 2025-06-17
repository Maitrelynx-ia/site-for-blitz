// backend/routes/share.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

let sharedContent = []; // À remplacer par une base de données plus tard

router.post("/", upload.single("file"), (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Non connecté" });

  const { type, title, description } = req.body;
  const file = req.file ? "/uploads/" + req.file.filename : null;
  const content = {
    type, title, description, file,
    author: req.session.user.nickname,
    date: new Date()
  };
  sharedContent.unshift(content);
  res.json({ message: "Contenu partagé !" });
});

router.get("/", (req, res) => {
  res.json(sharedContent);
});

module.exports = router;
