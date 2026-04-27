const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/messages/contacts - Получение списка контактов с которыми был чат (Optional Helper)
router.get('/contacts', async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT DISTINCT u.id, u.full_name as name, u.email
      FROM users u
      JOIN messages m ON (u.id = m.sender_id OR u.id = m.receiver_id)
      WHERE (m.sender_id = $1 OR m.receiver_id = $1) AND u.id != $1
    `;
    const result = await db.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Контакттарды алу қатесі:', err);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

// GET /api/messages/:userId - Белгілі қолданушымен chat тарихын алу
router.get('/:otherUserId', async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;
    
    // Mark messages from otherUserId as read when fetching
    await db.query(
      'UPDATE messages SET is_read = true WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false',
      [otherUserId, userId]
    );

    const query = `
      SELECT * FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
    `;
    const result = await db.query(query, [userId, otherUserId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Чат тарихын алу қатесі:', err);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

// POST /api/messages/ - Жаңа хабарлама жіберу
router.post('/', async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiver_id, message_text } = req.body;
    
    // Validation
    if (!message_text || message_text.trim() === '') {
      return res.status(400).json({ error: 'Хабарлама бос болмауы тиіс' });
    }
    if (message_text.length > 1000) {
      return res.status(400).json({ error: 'Хабарлама тым ұзын (макс: 1000 таңба)' });
    }

    const result = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, message_text) VALUES ($1, $2, $3) RETURNING *',
      [senderId, receiver_id, message_text.trim()]
    );
    
    // Get sender name
    const senderResult = await db.query('SELECT full_name FROM users WHERE id = $1', [senderId]);
    const senderName = senderResult.rows[0]?.full_name || 'Қолданушы';

    // Create chat notification for receiver
    const notifResult = await db.query(
      'INSERT INTO notifications (user_id, title, message, notification_type, sender_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [receiver_id, `💬 ${senderName}`, message_text.trim().substring(0, 60) + (message_text.length > 60 ? '...' : ''), 'chat', senderId]
    );

    if (req.io) {
      req.io.to(`user_${receiver_id}`).emit('new_message', result.rows[0]);
      req.io.to(`user_${receiver_id}`).emit('new_notification', notifResult.rows[0]);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Хабарлама жіберу қатесі:', err);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

module.exports = router;
