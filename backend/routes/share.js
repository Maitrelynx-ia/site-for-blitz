const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const User = require("../models/user");

router.post("/uploadReplay", async (req, res) => {
  if (!req.session.userId) return res.status(401).send("Non connecté");
  if (!req.files || !req.files.file) return res.status(400).send("Fichier manquant");
  const file = req.files.file;
  const filePath = `/uploads/replays/${Date.now()}-${file.name}`;
  file.mv(path.join(__dirname, "../../", filePath), async err => {
    if (err) return res.status(500).send("Erreur de fichier");
    await User.findByIdAndUpdate(req.session.userId, {
      $push: { replays: { title: req.body.title, filePath } }
    });
    res.send("Replay partagé !");
  });
});

router.post("/addTip", async (req, res) => {
  if (!req.session.userId) return res.status(401).send("Non connecté");
  const { title, content } = req.body;
  await User.findByIdAndUpdate(req.session.userId, {
    $push: { tips: { title, content } }
  });
  res.send("Astuce ajoutée !");
});

module.exports = router;