const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const shareRoutes = require('./routes/share');
const donateRoutes = require('./routes/donate');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/share', shareRoutes);
app.use('/donate', donateRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
