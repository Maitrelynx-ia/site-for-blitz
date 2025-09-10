// backend/routes/share.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const Share = require('../models/share');

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

// Soumission d’un replay ou d’une astuce
router.post('/submit', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  const { type, title, content } = req.body;
  const newShare = new Share({
    account_id: req.session.user.account_id,
    nickname: req.session.user.nickname,
    type,
    title,
    content
  });

  await newShare.save();
  res.json({ message: "Publié avec succès" });
});

// Récupérer les contenus d’un utilisateur
router.get('/user', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Non connecté" });

  const shares = await Share.find({ account_id: req.session.user.account_id }).sort({ createdAt: -1 });
  res.json(shares);
});

// Récupérer tout (partage.html)
router.get('/all', async (req, res) => {
  const all = await Share.find().sort({ createdAt: -1 });
  res.json(all);
});

// Like une publication
router.post('/like/:id', async (req, res) => {
  try {
    const share = await Share.findById(req.params.id);
    if (!share) return res.status(404).json({ message: "Publication non trouvée" });

    share.likes++;
    await share.save();
    res.json({ message: "Like ajouté", likes: share.likes });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// Ajouter un commentaire
router.post('/comment/:id', async (req, res) => {
  const { text } = req.body;
  const author = req.session.user?.nickname || "Anonyme";

  try {
    const share = await Share.findById(req.params.id);
    if (!share) return res.status(404).json({ message: "Publication non trouvée" });

    share.comments.push({ author, text });
    await share.save();
    res.json({ message: "Commentaire ajouté", comments: share.comments });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;