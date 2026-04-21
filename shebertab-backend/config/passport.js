const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const AppleStrategy = require('passport-apple');
const db = require('../db');
require('dotenv').config();

// Session serialization (Егер session қолдансақ)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const res = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, res.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

// OAuth ортақ логикасы (пайдаланушыны іздеу немесе құру)
const findOrCreateUser = async (profile, provider, done) => {
  try {
    const { id, displayName, emails } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : `${id}@${provider}.com`;
    const name = displayName || 'Пайдаланушы';

    // Дерекқордан іздеу
    const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userRes.rows.length > 0) {
      // Бар болса, соны қайтару
      return done(null, userRes.rows[0]);
    } else {
      // Жоқ болса, жаңасын құру
      const insertRes = await db.query(
        'INSERT INTO users (full_name, email, provider, provider_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, provider, id]
      );
      return done(null, insertRes.rows[0]);
    }
  } catch (err) {
    return done(err, null);
  }
};

// ─── GOOGLE ───
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    findOrCreateUser(profile, 'google', cb);
  }));
}

// ─── GITHUB ───
if (process.env.GITHUB_CLIENT_ID) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    findOrCreateUser(profile, 'github', done);
  }));
}

// ─── APPLE (Apple сәл күрделірек, сондықтан certificate/key талап етеді) ───
if (process.env.APPLE_CLIENT_ID) {
  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    callbackURL: process.env.APPLE_CALLBACK_URL,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
  }, function(req, accessToken, refreshToken, idToken, profile, cb) {
      // Apple profile объектісінде email idToken ішінде болады
      const jwt = require('jsonwebtoken');
      let email = idToken ? jwt.decode(idToken).email : `${Date.now()}@apple.com`;
      let name = 'Apple User';
      findOrCreateUser({ id: jwt.decode(idToken).sub || Date.now().toString(), displayName: name, emails: [{value: email}] }, 'apple', cb);
  }));
}
