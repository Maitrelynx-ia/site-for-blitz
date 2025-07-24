const express = require('express');
const router = express.Router();
const axios = require('axios');

// === CONFIG ===
const API_BASE = 'https://api.wotblitz.eu/wotb';
const APP_ID = process.env.WG_APP_ID || '0cd52ad2ab52ea7511013106881cc3f7';

// === UTILS ===
function buildUrl(endpoint, params = {}) {
  const query = new URLSearchParams({
    application_id: APP_ID,
    ...params
  });
  return `${API_BASE}/${endpoint}/?${query.toString()}`;
}

// === API CALLS ===
async function searchPlayer(nickname) {
  const url = buildUrl('account/list', { search: nickname, limit: 1 });
  const res = await axios.get(url);
  if (res.data.status === 'ok' && res.data.data.length > 0) {
    return res.data.data[0]; // {account_id, nickname}
  } else {
    throw new Error('Joueur non trouvé.');
  }
}

async function getPlayerInfo(account_id) {
  const url = buildUrl('account/info', { account_id });
  const res = await axios.get(url);
  if (res.data.status === 'ok') {
    return res.data.data[account_id];
  } else {
    throw new Error('Impossible de récupérer les infos du joueur.');
  }
}

async function getVehicles() {
  const url = buildUrl('encyclopedia/vehicles');
  const res = await axios.get(url);
  if (res.data.status === 'ok') {
    return res.data.data;
  } else {
    throw new Error('Impossible de récupérer les véhicules.');
  }
}

async function searchTankByName(tankName) {
  const vehicles = await getVehicles();
  const match = Object.values(vehicles).find(v =>
    v.name.toLowerCase().includes(tankName.toLowerCase())
  );
  if (!match) throw new Error("Aucun char correspondant trouvé.");
  return match;
}

// === ROUTES ===

// 🔍 Recherche joueur par pseudo
router.post('/players/search', async (req, res) => {
  const { nickname } = req.body;
  try {
    const player = await searchPlayer(nickname);
    const info = await getPlayerInfo(player.account_id);
    const stats = info?.statistics?.all || {};

    const avg_damage = stats.battles ? Math.round(stats.damage_dealt / stats.battles) : 0;
    const avg_xp = stats.battles ? Math.round(stats.xp / stats.battles) : 0;

    res.json({
      user: {
        nickname: player.nickname,
        stats: {
          battles: stats.battles || 0,
          wins: stats.wins || 0,
          avg_damage,
          avg_xp
        }
      }
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// 🔍 Recherche char par nom
router.get('/tanks/search', async (req, res) => {
  const name = req.query.name;
  try {
    const tank = await searchTankByName(name);
    res.json({ tank });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

module.exports = router;
