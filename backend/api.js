// backend/api.js
const axios = require("axios");


// URL de base pour l'API WOT Blitz
const BASE_URL = "https://api.wotblitz.eu/wotb/";

// Fonction pour récupérer la liste des comptes
async function getAccountsList(apiKey, realm = "eu") {
  try {
    const response = await axios.get(`${BASE_URL}account/list/`, {
      params: {
        application_id: apiKey,  // Ta clé API
        r_realm: realm,          // Le domaine (par défaut "eu")
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des comptes:", error);
    throw error;
  }
}

// Fonction pour récupérer les informations d'un joueur
async function getPlayerInfo(accountId, apiKey) {
  try {
    const response = await axios.get(`${BASE_URL}account/info/`, {
      params: {
        application_id: apiKey,  // Ta clé API
        account_id: accountId,   // ID du joueur
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des infos du joueur:", error);
    throw error;
  }
}

// Fonction pour récupérer les stats de tank d'un joueur
async function getTankStats(accountId, apiKey) {
  try {
    const response = await axios.get(`${BASE_URL}account/tankstats/`, {
      params: {
        application_id: apiKey,
        account_id: accountId,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des stats de tanks:", error);
    throw error;
  }
}

// Fonction pour récupérer les réalisations des tanks d'un joueur
async function getTankAchievements(accountId, apiKey) {
  try {
    const response = await axios.get(`${BASE_URL}tanks/achievements/`, {
      params: {
        application_id: apiKey,
        account_id: accountId,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des réalisations des tanks:", error);
    throw error;
  }
}

// Fonction pour récupérer la liste des véhicules dans l'encyclopédie
async function getVehicles(apiKey) {
  try {
    const response = await axios.get(`${BASE_URL}encyclopedia/vehicles/`, {
      params: {
        application_id: apiKey,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des véhicules:", error);
    throw error;
  }
}

// Exporter les fonctions pour pouvoir les utiliser ailleurs dans le backend
module.exports = {
  getAccountsList,
  getPlayerInfo,
  getTankStats,
  getTankAchievements,
  getVehicles
};
