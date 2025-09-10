const express = require("express");
const fetch = require("node-fetch"); // npm install node-fetch
const router = express.Router();

const APP_ID = "0cd52ad2ab52ea7511013106881cc3f7";

// 🔍 Étape 1 : Recherche joueur
router.post("/players/search", async (req, res) => {
  const { nickname } = req.body;

  try {
    const response = await fetch(
      `https://api.wotblitz.eu/wotb/account/list/?application_id=${APP_ID}&search=${encodeURIComponent(nickname)}`
    );
    const data = await response.json();

    if (data?.data?.length > 0) {
      const user = data.data[0];

      // Étape 2 : Récupérer les stats avec son account_id
      const statsResponse = await fetch(
        `https://api.wotblitz.eu/wotb/account/info/?application_id=${APP_ID}&account_id=${user.account_id}`
      );
      const statsData = await statsResponse.json();

      const stats = statsData.data[user.account_id] || {};

      res.json({
        user: {
          account_id: user.account_id,
          nickname: user.nickname,
          stats: {
            battles: stats.statistics?.all?.battles || 0,
            wins: stats.statistics?.all?.wins || 0,
            survival_rate: stats.statistics?.all?.survived_battles || 0,
            avg_xp: stats.statistics?.all?.battle_avg_xp || 0,
            max_xp: stats.statistics?.all?.max_xp || 0,
            avg_damage: stats.statistics?.all?.damage_dealt
              ? Math.round(stats.statistics.all.damage_dealt / stats.statistics.all.battles)
              : 0,
          },
        },
      });
    } else {
      res.status(404).json({ message: "Joueur non trouvé." });
    }
  } catch (err) {
    console.error("Erreur API Wargaming:", err);
    res.status(500).json({ message: "Erreur lors de la recherche du joueur" });
  }
});

module.exports = router;
