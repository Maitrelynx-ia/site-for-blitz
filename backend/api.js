// backend/api_wg.js
const axios = require("axios");
require("dotenv").config();

const BASE = "https://api.wotblitz.eu/wotb/";
const KEY = process.env.WG_API_KEY;
const REALM = process.env.WG_REALM || "eu";

// Recherche de joueurs par pseudo
async function getAccountList(nickname) {
  const r = await axios.get(BASE + "account/list/", {
    params: { application_id: KEY, search: nickname, r_realm: REALM }
  });
  return r.data.data;
}

// Récupération des stats d’un joueur via account_id
async function getAccountInfo(account_id) {
  const r = await axios.get(BASE + "account/info/", {
    params: { application_id: KEY, account_id, fields: "nickname,statistics.all" }
  });
  return r.data.data[account_id];
}

module.exports = { getAccountList, getAccountInfo };
