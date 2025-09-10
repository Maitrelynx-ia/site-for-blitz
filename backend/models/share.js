const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
// 📝 Créer une publication
router.post("/share", async (req, res) => {
try {
const { title, content } = req.body;
const user = req.session.user;
const share = new Share({
title,
content,
nickname: user.nickname,
account_id: user.account_id
});
await share.save();
res.json(share);
} catch (e) {
res.status(500).json({ message: "Erreur serveur" });
}
});


// 🗑️ Supprimer une publication
router.delete("/share/:id", async (req, res) => {
try {
const share = await Share.findById(req.params.id);
if (!share) return res.status(404).json({ message: "Non trouvé" });
if (!req.session.user || req.session.user.account_id !== share.account_id) return res.status(403).json({ message: "Non autorisé" });
await Share.findByIdAndDelete(req.params.id);
res.json({ message: "Supprimé" });
} catch {
res.status(500).json({ message: "Erreur" });
}
});


// 👍 Like publication
router.post("/share/:id/like", async (req, res) => {
  try {
    const share = await Share.findById(req.params.id);
    if (!share) {
      return res.status(404).json({ message: "Publication non trouvée" });
    }

    share.likes += 1;
    await share.save();

    res.json({ likes: share.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
