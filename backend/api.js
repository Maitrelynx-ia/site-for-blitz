// backend/routes/api.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Ta clé (par défaut on met celle que tu as fournie, mais tu peux la stocker en .env WG_APP_ID)
const APP_ID = process.env.WG_APP_ID || '0cd52ad2ab52ea7511013106881cc3f7';
const BASE = 'https://api.wotblitz.eu/wotb';

// ---------- UTIL ----------
function safeNumber(v) {
  return typeof v === 'number' ? v : Number(v) || 0;
}

// ---------- RECHERCHE JOUEUR (account/list -> account/info) ----------
// GET /api/players/search?nickname=Pseudo
router.get('/players/search', async (req, res) => {
  const nickname = req.query.nickname || req.query.q || req.query.name;
  if (!nickname) return res.status(400).json({ message: 'Pseudo requis' });

  try {
    // 1) chercher l'account via /account/list/
    const listUrl = `${BASE}/account/list/`;
    const listResp = await axios.get(listUrl, {
      params: {
        application_id: APP_ID,
        search: nickname
      },
      timeout: 10_000
    });

    const listData = listResp.data;
    if (!listData || !listData.data || listData.data.length === 0) {
      return res.status(404).json({ message: 'Joueur non trouvé' });
    }

    // On prend le premier résultat
    const player = listData.data[0]; // contient account_id, nickname, etc.
    const accountId = player.account_id;

    // 2) récupérer les détails/statistiques via /account/info/
    const infoUrl = `${BASE}/account/info/`;
    const infoResp = await axios.get(infoUrl, {
      params: {
        application_id: APP_ID,
        account_id: accountId
      },
      timeout: 10_000
    });

    const infoData = infoResp.data;
    const accountInfo = infoData && infoData.data && infoData.data[accountId] ? infoData.data[accountId] : null;
    if (!accountInfo) {
      return res.status(404).json({ message: 'Infos du joueur introuvables' });
    }

    // extraire les stat utiles (défensif : vérifications)
    const s = accountInfo.statistics && accountInfo.statistics.all ? accountInfo.statistics.all : {};

    const battles = safeNumber(s.battles);
    const wins = safeNumber(s.wins);
    const damage_dealt = safeNumber(s.damage_dealt);
    const damage_received = safeNumber(s.damage_received);
    const shots = safeNumber(s.shots);
    const hits = safeNumber(s.hits);
    const xp_total = safeNumber(s.xp);
    const max_xp = safeNumber(s.max_xp);
    const survived_battles = safeNumber(s.survived_battles);
    const capture_points = safeNumber(s.capture_points);
    const dropped_capture_points = safeNumber(s.dropped_capture_points);
    const tanks_owned = safeNumber(s.vehicles || s.vehicles_count || 0); // fallback

    const avg_damage = battles ? Math.round(damage_dealt / battles) : 0;
    const avg_xp = battles ? Math.round(xp_total / battles) : 0;
    const win_rate = battles ? ((wins / battles) * 100).toFixed(2) : '0.00';
    const survival_rate = battles ? ((survived_battles / battles) * 100).toFixed(2) : '0.00';
    const dmg_per_shot = shots ? (damage_dealt / shots).toFixed(2) : null;
    const dmg_per_hit = hits ? (damage_dealt / hits).toFixed(2) : null;
    const damage_ratio = damage_received ? (damage_dealt / damage_received).toFixed(2) : null;
    const avg_capture = battles ? (capture_points / battles).toFixed(2) : '0.00';
    const avg_defense = battles ? (dropped_capture_points / battles).toFixed(2) : '0.00';

    // Retour structuré pour le frontend
    return res.json({
      account_id: accountId,
      nickname: player.nickname,
      // raw info (tu peux renvoyer plus d'infos si besoin)
      stats: {
        battles,
        wins,
        win_rate,            // en %
        survival_rate,       // en %
        avg_xp,
        max_xp,
        avg_damage,
        dmg_per_shot,
        dmg_per_hit,
        damage_ratio,
        avg_capture,
        avg_defense,
        tanks_owned
      }
    });
  } catch (err) {
    console.error('Erreur players/search:', err?.message || err);
    return res.status(500).json({ message: 'Erreur lors de la recherche du joueur' });
  }
});

// ---------- RECHERCHE CHAR (encyclopedia/vehicles -> optional vehicleprofile) ----------
// GET /api/tanks/search?name=CharName
router.get('/tanks/search', async (req, res) => {
  const name = req.query.name || req.query.q;
  if (!name) return res.status(400).json({ message: 'Nom du char requis' });

  try {
    // 1) récupérer la liste des véhicules
    const vehUrl = `${BASE}/encyclopedia/vehicles/`;
    const vehResp = await axios.get(vehUrl, {
      params: {
        application_id: APP_ID,
        language: 'fr' // tu peux changer la langue
      },
      timeout: 15_000
    });

    const vehicles = vehResp.data && vehResp.data.data ? vehResp.data.data : {};
    const all = Object.values(vehicles);

    // 2) chercher correspondance (insensible à la casse, contient)
    const match = all.find(v => (v.name || '').toLowerCase().includes(name.toLowerCase()));

    if (!match) return res.status(404).json({ message: 'Char non trouvé' });

    // optional : récupérer le profile détaillé via /encyclopedia/vehicleprofile/
    // l'API peut utiliser le champ 'vehicle_id' ou 'tank_id' selon la version
    const vehicleId = match.vehicle_id || match.tank_id || match.id || match.key || null;

    let profile = null;
    if (vehicleId) {
      try {
        const profUrl = `${BASE}/encyclopedia/vehicleprofile/`;
        const profResp = await axios.get(profUrl, {
          params: {
            application_id: APP_ID,
            vehicle_id: vehicleId,
            language: 'fr'
          },
          timeout: 10000
        });
        profile = profResp.data && profResp.data.data && profResp.data.data[vehicleId] ? profResp.data.data[vehicleId] : null;
      } catch (e) {
        // si profile échoue, on ignore (on renvoie match minimal)
        console.warn('vehicleprofile failed:', e?.message || e);
      }
    }

    // Construire réponse utile
    const tank = {
      name: match.name,
      tier: match.tier,
      nation: match.nation,
      type: match.type,
      short_name: match.short_name || null,
      vehicle_id: vehicleId,
      profile // éventuellement null
    };

    return res.json({ tank });
  } catch (err) {
    console.error('Erreur tanks/search:', err?.message || err);
    return res.status(500).json({ message: 'Erreur lors de la recherche du char' });
  }
});

module.exports = router;
