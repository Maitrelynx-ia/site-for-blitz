const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/", async (req, res) => {
  const { username, amount } = req.body;
  if (!username || !amount) return res.status(400).send("Données manquantes");
  let user = await User.findOne({ username });
  if (!user) user = await User.create({ username });
  user.donations.push({ amount, date: new Date() });
  await user.save();
  res.send("Merci pour votre don !");
});

router.get("/donors", async (req, res) => {
  const donors = await User.find({ donations: { $exists: true, $not: { $size: 0 } } }).select("username");
  res.json(donors.map((u) => u.username));
});

module.exports = router;
