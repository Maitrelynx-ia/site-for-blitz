const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  wargamingId: String,
  username: String,
  stats: Object,
  replays: [{ title: String, filePath: String }],
  tips: [{ title: String, content: String }],
  donations: [{ amount: Number, date: Date }]
});
module.exports = mongoose.model("User", userSchema);
