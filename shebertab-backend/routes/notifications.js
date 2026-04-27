const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/notifications - Пайдаланушының хабарламаларын алу
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id; // requires authMiddleware in server.js
    const result = await db.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Хабарландыруларды алу қатесі:', err);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

// PATCH /api/notifications/:id/read - Хабарламаны оқылды деп белгілеу
router.patch('/:id/read', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Check ownership
    const check = await db.query('SELECT user_id FROM notifications WHERE id = $1', [id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Табылмады' });
    if (check.rows[0].user_id !== userId) return res.status(403).json({ error: 'Рұқсат жоқ' });

    const result = await db.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Хабарландыруды жаңарту қатесі:', err);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

module.exports = router;
