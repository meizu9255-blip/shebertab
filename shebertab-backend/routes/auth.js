const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_here';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ─── Nodemailer Transporter ───
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// ─── Нұсқаулық: Ортақ JWT жасау функциясы ───
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.full_name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ─── 1. REGISTER (Тіркелу) ───
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Email бар-жоғын тексеру
    const checkUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'Бұл email тіркелген!' });
    }

    // Парольді хэштеу
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Дерекқорға сақтау
    const newUser = await db.query(
      'INSERT INTO users (full_name, email, password_hash, provider) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role',
      [name, email, password_hash, 'local']
    );

    const token = generateToken(newUser.rows[0]);

    res.status(201).json({ user: newUser.rows[0], token });
  } catch (error) {
    console.error('Тіркелу қатесі:', error);
    res.status(500).json({ error: 'Сервер қатесі орын алды' });
  }
});

// ─── 2. LOGIN (Кіру) ───
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(400).json({ error: 'Пайдаланушы табылмады немесе email қате!' });
    }

    const user = userRes.rows[0];

    // Егер пароль арқылы емес, OAuth арқылы тіркелген болса
    if (!user.password_hash) {
      return res.status(400).json({ error: `Бұл аккаунт ${user.provider} арқылы тіркелген.` });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Құпиясөз қате!' });
    }

    const token = generateToken(user);
    res.json({ user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role }, token });
  } catch (error) {
    console.error('Кіру қатесі:', error);
    res.status(500).json({ error: 'Сервер қатесі орын алды' });
  }
});

// ─── 3. GET CURRENT USER (Токен арқылы мәліметті алу) ───
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Авторизация қажет' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Жарамсыз токен' });
  }
});

// ─── 4. UPDATE PROFILE (Аты-жөні мен Email өзгерту) ───
router.put('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Авторизация қажет' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, email } = req.body;

    // Email бос болмауы керек
    if (!email || !name) return res.status(400).json({ error: 'Мәліметтерді толық толтырыңыз' });

    // Басқа пайдаланушы бұл email-ді алып жүрмегеніне көз жеткізу
    const checkEmail = await db.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, decoded.id]);
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ error: 'Бұл email басқа аккаунтқа тіркелген' });
    }

    const updated = await db.query(
      'UPDATE users SET full_name = $1, email = $2 WHERE id = $3 RETURNING id, full_name, email',
      [name, email, decoded.id]
    );

    // Жаңа мәліметтермен токенді қайта құруу
    const newToken = generateToken(updated.rows[0]);
    res.json({ user: updated.rows[0], token: newToken });

  } catch (error) {
    console.error('Профиль жаңарту қатесі:', error);
    res.status(500).json({ error: 'Сервер қатесі орын алды' });
  }
});

// ─── 5. UPDATE PASSWORD (Құпиясөзді өзгерту) ───
router.put('/password', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Авторизация қажет' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { oldPassword, newPassword } = req.body;

    const userRes = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
    const user = userRes.rows[0];

    // Егер OAuth болса, пароль болмауы мүмкін
    if (!user.password_hash) {
      return res.status(400).json({ error: 'Сіз жүйеге әлеуметтік желі арқылы кіргенсіз, құпиясөз өзгерту мүмкін емес.' });
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Ескі құпиясөз қате!' });
    }

    const salt = await bcrypt.genSalt(10);
    const new_password_hash = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [new_password_hash, decoded.id]);
    res.json({ success: true, message: 'Құпиясөз сәтті өзгертілді' });

  } catch (error) {
    console.error('Пароль өзгерту қатесі:', error);
    res.status(500).json({ error: 'Сервер қатесі орын алды' });
  }
});


// ─── 6. FORGOT PASSWORD (Құпиясөзді ұмытқанда хат жіберу) ───
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Электрондық поштаны енгізіңіз' });

    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'Ондай пошта тіркелмеген' });
    }

    const user = userRes.rows[0];

    // Allowed even for OAuth users so they can set up a local password
    const secret = JWT_SECRET + (user.password_hash || 'no-password');
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '15m' });

    const resetLink = `${FRONTEND_URL}/reset-password/${user.id}/${token}`;

    const mailOptions = {
      from: `"SheberTab" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'SheberTab: Құпиясөзді қалпына келтіру',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
          <h2 style="color: #0891B2;">Құпиясөзді өзгерту</h2>
          <p>Сәлеметсіз бе, <b>${user.full_name}</b>!</p>
          <p>Сіз немесе біреу SheberTab аккаунтыңыздың құпиясөзін өзгертуге сұраныс жіберді.</p>
          <p>Егер бұл сіз болсаңыз, төмендегі батырманы басып жаңа құпиясөз орнатыңыз (сілтеме тек 15 минут жарамды):</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #0891B2; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0;">Құпиясөзді ауыстыру</a>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">Егер бұл сұранысты сіз жасамасаңыз, бұл хатты елемеңіз.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Құпиясөзді қалпына келтіру сілтемесі поштаңызға жіберілді!' });

  } catch (error) {
    console.error('Forgot Password қатесі:', error);
    res.status(500).json({ error: 'Сілтеме жіберу мүмкін болмады (SMTP баптауларын тексеріңіз)' });
  }
});

// ─── 7. RESET PASSWORD (Сілтеме арқылы жаңа құпиясөз) ───
router.post('/reset-password/:id/:token', async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Құпиясөз кемінде 6 таңбадан тұруы керек' });
    }

    const userRes = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userRes.rows.length === 0) {
      return res.status(400).json({ error: 'Пайдаланушы табылмады' });
    }

    const user = userRes.rows[0];
    const secret = JWT_SECRET + (user.password_hash || 'no-password');

    try {
      jwt.verify(token, secret);
    } catch (err) {
      return res.status(400).json({ error: 'Сілтеме ескірген немесе жарамсыз' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, id]);
    res.json({ success: true, message: 'Құпиясөз сәтті жаңартылды! Жүйеге кіре аласыз.' });

  } catch (error) {
    console.error('Reset Password қатесі:', error);
    res.status(500).json({ error: 'Сервер қатесі орын алды' });
  }
});


module.exports = router;
