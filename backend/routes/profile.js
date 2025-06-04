const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", async (req, res) => {
  if (!req.session.userId) return res.status(401).send("Non connecté");
  const user = await User.findById(req.session.userId);
  if (!user) return res.status(404).send("Utilisateur introuvable");
  res.json(user);
});