const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/user');

const APPLICATION_ID = 'TON_APP_ID';
const REDIRECT_URI = 'http://https://maitrelynx-ia.github.io/site-for-blitz/frontend/login.html/auth/wargaming/callback';

// Redirige vers Wargaming pour l'authentification
router.get('/wargaming', (req, res) => {
  const authUrl = `https://api.wotblitz.eu/wotb/auth/login/?application_id=${APPLICATION_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  res.redirect(authUrl);
});



router.get('/wargaming/callback', async (req, res) => {
  const { access_token, account_id, nickname } = req.query;

  if (!access_token || !account_id) {
    return res.redirect('/login.html');
  }

  // Stockage dans MongoDB
  let user = await User.findOne({ account_id });
  if (!user) {
    user = new User({ account_id, nickname, access_token });
  } else {
    user.access_token = access_token;
    user.nickname = nickname;
  }
  await user.save();

  // Stockage en session
  req.session.user = {
    access_token,
    account_id,
    nickname
  };

  res.redirect('/profile.html');
});
