// backend/routes/auth.js
const express = require("express");
const { getAccountList, getAccountInfo } = require("../api_wg");
const router = express.Router();

router.post("/login-nick", async (req, res) => {
  const nick = req.body.nickname;
  if (!nick) return res.status(400).json({ message: "Pseudo requis" });

  try {
    const list = await getAccountList(nick);
    if (!list || list.length === 0)
      return res.status(404).json({ message: "Aucun joueur trouvé" });

    const account_id = list[0].account_id;
    const info = await getAccountInfo(account_id);

    req.session.user = {
      account_id,
      nickname: info.nickname,
      stats: info.statistics.all
    };
    res.json({ message: "Connecté", user: req.session.user });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/status", (req, res) => {
  res.json({ loggedIn: !!req.session.user, user: req.session.user || null });
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
});

module.exports = router;
