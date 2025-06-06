const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

let sharedContent = []; // Simulé. À remplacer plus tard par une DB

router.post('/', upload.single('file'), (req, res) => {
  const { type, title, description } = req.body;
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;

  const content = {
    type,
    title,
    description,
    file: filePath,
    date: new Date()
  };

  sharedContent.unshift(content);
  res.status(200).json({ message: 'Partage réussi' });
});

router.get('/', (req, res) => {
  res.json(sharedContent);
});

module.exports = router;
