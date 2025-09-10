const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const APP_ID = "0cd52ad2ab52ea7511013106881cc3f7";

// 🔍 Recherche joueur par pseudo + stats
router.get("/players/search", async (req, res) => {
  const { nickname } = req.query;
  if (!nickname) return res.status(400).json({ message: "Pseudo requis" });

  try {
    // Étape 1 : chercher l'account_id
    const listRes = await fetch(
      `https://api.wotblitz.eu/wotb/account/list/?application_id=${APP_ID}&search=${encodeURIComponent(nickname)}`
    );
    const listData = await listRes.json();

    if (!listData?.data?.length) {
      return res.status(404).json({ message: "Joueur non trouvé" });
    }

    const user = listData.data[0];

    // Étape 2 : récupérer les stats
    const infoRes = await fetch(
      `https://api.wotblitz.eu/wotb/account/info/?application_id=${APP_ID}&account_id=${user.account_id}`
    );
    const infoData = await infoRes.json();

    const stats = infoData.data[user.account_id]?.statistics?.all || {};

    res.json({
      account_id: user.account_id,
      nickname: user.nickname,
      stats: {
        battles: stats.battles || 0,
        wins: stats.wins || 0,
        survival_rate: stats.survived_battles || 0,
        avg_xp: stats.battle_avg_xp || 0,
        max_xp: stats.max_xp || 0,
        avg_damage: stats.battles
          ? Math.round(stats.damage_dealt / stats.battles)
          : 0,
        damage_ratio: stats.damage_received
          ? (stats.damage_dealt / stats.damage_received).toFixed(2)
          : 0,
      },
    });
  } catch (err) {
    console.error("Erreur API:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
