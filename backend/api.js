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
// 🔍 Statistiques avancées d'un joueur
router.get('/players/stats/:account_id', async (req, res) => {
  const accountId = req.params.account_id;

  try {
    const info = await getPlayerInfo(accountId);
    const stats = info?.statistics?.all || {};

    const battles = stats.battles || 0;
    const damageDealt = stats.damage_dealt || 0;
    const hits = stats.hits || 0;
    const shots = stats.shots || 1;
    const frags = stats.frags || 0;
    const survived = stats.survived_battles || 0;
    const wins = stats.wins || 0;
    const xp = stats.xp || 0;
    const losses = stats.losses || 1;
    const capture = stats.capture_points || 0;
    const dropped = stats.dropped_capture_points || 0;
    const damageReceived = stats.damage_received || 1;

    res.json({
      battles,
      winRate: ((wins / battles) * 100).toFixed(2),
      survivalRate: ((survived / battles) * 100).toFixed(2),
      avgXp: Math.round(xp / battles),
      maxXp: stats.max_xp || 0,
      avgWinsPerBattle: (wins / battles).toFixed(2),
      avgFrags: (frags / battles).toFixed(2),
      avgDamage: Math.round(damageDealt / battles),
      dmgPerShot: (damageDealt / shots).toFixed(2),
      dmgPerHit: (damageDealt / hits).toFixed(2),
      avgCapture: (capture / battles).toFixed(2),
      avgDefense: (dropped / battles).toFixed(2),
      dmgRatio: (damageDealt / damageReceived).toFixed(2),
      hitRatio: ((hits / shots) * 100).toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, nickname: req.session.user.nickname });
  } else {
    res.json({ loggedIn: false });
  }
});
