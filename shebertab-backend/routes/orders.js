const express = require('express');
const router = express.Router();
const db = require('../db');

// GET пайдаланушының (клиент немесе маман) тапсырыстарын алу
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT o.id, o.status, o.created_at, o.is_rated, o.client_id, w.id as worker_id, w.user_id as worker_user_id,
             c.full_name as client_name, c.phone as client_phone,
             w_u.full_name as worker_name, s.title as service_name,
             w.price_range
      FROM orders o
      JOIN users c ON o.client_id = c.id
      JOIN workers w ON o.worker_id = w.id
      JOIN users w_u ON w.user_id = w_u.id
      JOIN services s ON w.service_id = s.id
      WHERE o.client_id = $1 OR w.user_id = $1
      ORDER BY o.created_at DESC
    `;
    const result = await db.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Тапсырыстарды алу қатесі:', err);
    res.status(500).json({ error: 'Сервер қатесі: Тапсырыстарды алу мүмкін емес' });
  }
});

// POST жаңа тапсырыс беру
router.post('/', async (req, res) => {
  try {
    const { client_id, worker_id } = req.body;
    
    // Өзіңе өзің тапсырыс беруге тыйым салу
    const workerCheck = await db.query('SELECT user_id FROM workers WHERE id = $1', [worker_id]);
    if (workerCheck.rows[0]?.user_id === client_id) {
      return res.status(400).json({ error: 'Өзіңізге тапсырыс бере алмайсыз!' });
    }

    const result = await db.query(
      'INSERT INTO orders (client_id, worker_id) VALUES ($1, $2) RETURNING *',
      [client_id, worker_id]
    );

    // Create a notification for the worker
    const workerUserId = workerCheck.rows[0].user_id;
    const notifResult = await db.query(
      'INSERT INTO notifications (user_id, title, message, notification_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [workerUserId, 'Жаңа тапсырыс! 📋', `Сізге жаңа тапсырыс түсті (Тапсырыс #${result.rows[0].id})`, 'order_new']
    );

    if (req.io) {
      req.io.to(`user_${workerUserId}`).emit('new_notification', notifResult.rows[0]);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Тапсырыс беру қатесі:', err);
    res.status(500).json({ error: 'Сервер қатесі: Тапсырысты құру мүмкін емес' });
  }
});

// PUT тапсырыс статусын жаңарту
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    // Notify the client about status change
    const order = result.rows[0];
    
    if (status === 'completed') {
      // Special notification for completion - ask to rate
      const notifResult = await db.query(
        'INSERT INTO notifications (user_id, title, message, notification_type) VALUES ($1, $2, $3, $4) RETURNING *',
        [order.client_id, 'Жұмыс аяқталды! ✅', `Тапсырыс #${order.id} сәтті аяқталды. Бағалап жіберіңіз!`, 'rating_prompt']
      );
      if (req.io) req.io.to(`user_${order.client_id}`).emit('new_notification', notifResult.rows[0]);
    } else {
      let statusText = status === 'accepted' ? 'қабылданды' : 'бас тартылды';
      const notifResult = await db.query(
        'INSERT INTO notifications (user_id, title, message, notification_type) VALUES ($1, $2, $3, $4) RETURNING *',
        [order.client_id, 'Тапсырыс статусы өзгерді', `Сіздің #${order.id} тапсырысыңыз ${statusText}.`, 'order_update']
      );
      if (req.io) req.io.to(`user_${order.client_id}`).emit('new_notification', notifResult.rows[0]);
    }

    res.json(order);
  } catch (err) {
    console.error('Статус жаңарту қатесі:', err);
    res.status(500).json({ error: 'Сервер қатесі: Статусты жаңарту мүмкін емес' });
  }
});

module.exports = router;
