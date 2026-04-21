const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const passport = require('passport');
require('./config/passport'); // Passport стратегияларын қосу

const app = express();
const PORT = process.env.PORT || 5000;

// Мидлвэрлер
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Маршруттар
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('SheberTab Backend жұмыс істеп тұр!');
});

app.listen(PORT, () => {
  console.log(`Сервер http://localhost:${PORT} адресінде іске қосылды`);
});
