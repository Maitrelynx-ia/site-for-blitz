const express = require('express');
const axios = require('axios');
const router = express.Router();
const APPLICATION_ID = '0cd52ad2ab52ea7511013106881cc3f7'; // Remplace par ton ID

// Rechercher un joueur
router.get('/search-player', async (req, res) => {
  try {
    const query = req.query.q;
    const response = await axios.get(`https://api.wargaming.net/wotb/account/list/`, {
      params: {
        application_id: APPLICATION_ID,
        search: query
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer la liste des chars
router.get('/tanks-list', async (req, res) => {
  try {
    const response = await axios.get(`https://api.wargaming.net/wotb/encyclopedia/tanks/`, {
      params: {
        application_id: APPLICATION_ID
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
