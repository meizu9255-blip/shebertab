const express = require('express');
const router = express.Router();
const db = require('../db');

// GET барлық қызметтер
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Сервер қатесі: Қызметтерді алу мүмкін емес' });
  }
});

// POST жаңа қызмет түрін қосу
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const result = await db.query(
      'INSERT INTO services (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Сервер қатесі: Қызметті қосу мүмкін емес' });
  }
});

module.exports = router;
