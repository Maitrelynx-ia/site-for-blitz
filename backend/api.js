// Configuration de base pour l'API Wargaming
const APPLICATION_ID = "TON_APPLICATION_ID"; // Remplace par ton ID
const BASE_URL = "https://api.wargaming.net/wotb/";

// Fonction générique pour appeler l'API
async function callWargamingAPI(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  params.application_id = APPLICATION_ID;

  // Ajouter les paramètres à l'URL
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de l'appel API:", error);
    throw error;
  }
}

// Rechercher un joueur par nickname
export async function searchPlayer(nickname) {
  return callWargamingAPI("account/list/", { search: nickname });
}

// Récupérer les statistiques d'un joueur
export async function getPlayerStats(accountId) {
  return callWargamingAPI("account/info/", { account_id: accountId, fields: "statistics.global" });
}

// Récupérer la liste des chars (encyclopédie)
export async function getTanksList(nation = null, tier = null) {
  const params = {};
  if (nation) params.nation = nation;
  if (tier) params.tier = tier;
  return callWargamingAPI("encyclopedia/tanks/", params);
}
