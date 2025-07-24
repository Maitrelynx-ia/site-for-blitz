const express = require('express');
const router = express.Router();
const axios = require('axios');

const APPLICATION_ID = 'TON_APP_ID';
const REDIRECT_URI = 'http://localhost:3000/auth/wargaming/callback';

// Redirige vers Wargaming pour l'authentification
router.get('/wargaming', (req, res) => {
  const authUrl = `https://api.wotblitz.eu/wotb/auth/login/?application_id=${APPLICATION_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  res.redirect(authUrl);
});

// Callback après l'authentification
router.get('/wargaming/callback', async (req, res) => {
  const { access_token, account_id, nickname } = req.query;

  if (!access_token || !account_id) {
    return res.redirect('/login.html');
  }

  // Stocker l’utilisateur dans la session
  req.session.user = {
    access_token,
    account_id,
    nickname
  };

  res.redirect('/profile.html');
});

// Déconnexion
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/index.html');
  });
});

module.exports = router;
