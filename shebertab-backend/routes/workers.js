const express = require('express');
const router = express.Router();
const db = require('../db');

// GET барлық мамандарды алу
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT w.id, w.user_id, u.full_name as name, u.email, u.phone,
             w.service_id, s.title as service_name,
             w.price_range, w.average_time, w.rating
      FROM workers w
      JOIN users u ON w.user_id = u.id
      JOIN services s ON w.service_id = s.id
      ORDER BY w.rating DESC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Мамандарды алу қатесі:', err);
    res.status(500).json({ error: 'Сервер қатесі: Мамандарды алу мүмкін емес' });
  }
});

// POST жаңа маман қосу
router.post('/', async (req, res) => {
  try {
    const { user_id, service_id, price_range, average_time } = req.body;
    
    // Check if worker already exists
    const check = await db.query('SELECT id FROM workers WHERE user_id = $1', [user_id]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: 'Сіз тіркеліп қойғансыз!' });
    }

    const result = await db.query(
      'INSERT INTO workers (user_id, service_id, price_range, average_time) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, service_id, price_range, average_time]
    );

    // Update user role to worker
    await db.query("UPDATE users SET role = 'worker' WHERE id = $1", [user_id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Маман тіркеу қатесі:', err);
    res.status(500).json({ error: 'Сервер қатесі: Маманды қосу мүмкін емес' });
  }
});

// PUT маманды бағалау
router.put('/:id/rating', async (req, res) => {
  try {
    const { rating, order_id } = req.body;
    // Оңайлатылған бағалау: қазіргі бағаны жаңа бағамен алмастыру немесе орташасын табу
    // Практикалық жұмыс үшін жаңа бағаны орнатамыз
    const result = await db.query(
      'UPDATE workers SET rating = $1 WHERE id = $2 RETURNING *',
      [rating, req.params.id]
    );

    // If order_id is provided, mark that order as rated
    if (order_id) {
      await db.query('UPDATE orders SET is_rated = true WHERE id = $1', [order_id]);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Маманды бағалау қатесі:', err);
    res.status(500).json({ error: 'Сервер қатесі: Бағалау мүмкін емес' });
  }
});

// DELETE маманды өшіру
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM workers WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Маман табылмады' });
    }

    // Қаласаңыз, оның user кестесіндегі ролін қайтадан 'client' етіп өзгертуге болады
    // await db.query("UPDATE users SET role = 'client' WHERE id = $1", [result.rows[0].user_id]);

    res.json({ message: 'Маман сәтті өшірілді', deleted: result.rows[0] });
  } catch (err) {
    console.error('Маманды өшіру қатесі:', err);
    res.status(500).json({ error: 'Сервер қатесі: Маманды өшіру мүмкін емес' });
  }
});

module.exports = router;
