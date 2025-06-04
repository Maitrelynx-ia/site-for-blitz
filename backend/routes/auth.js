// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const { getAccountsList, getPlayerInfo, getTankStats } = require("../api"); // Import des fonctions API

// Route pour récupérer la liste des comptes
router.get("/accounts", async (req, res) => {
  const apiKey = "0cd52ad2ab52ea7511013106881cc3f7";  // Clé API
  try {
    const accounts = await getAccountsList(apiKey);
    res.json(accounts);  // Envoie la liste des comptes au frontend
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération des comptes");
  }
});

// Route pour récupérer les informations d'un joueur
router.get("/player/:accountId", async (req, res) => {
  const { accountId } = req.params;
  const apiKey = "0cd52ad2ab52ea7511013106881cc3f7";  // Clé API
  try {
    const playerInfo = await getPlayerInfo(accountId, apiKey);
    res.json(playerInfo);  // Envoie les infos du joueur au frontend
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération des infos du joueur");
  }
});

module.exports = router;
