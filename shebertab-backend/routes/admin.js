const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Log middleware specifically for admin routes (as requested in Practical Work 4)
const adminLogger = (req, res, next) => {
  console.log(`[ADMIN LOG] ${new Date().toISOString()} - ${req.user.email} accessed ${req.method} ${req.originalUrl}`);
  next();
};

// All admin routes must be authenticated, be an 'admin', and log the action
router.use(verifyToken, requireRole('admin'), adminLogger);

// ─── USERS MANAGEMENT ───

// GET /api/admin/users - Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await db.query('SELECT id, full_name, email, role, phone, provider, created_at FROM users ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

// PUT /api/admin/users/:id/role - Change user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['admin', 'client', 'worker'].includes(role)) {
      return res.status(400).json({ error: 'Рұқсат етілмеген рөл түрі' });
    }

    // You can't change your own role to something else if you are the only admin (optional safety check)
    if (req.user.id === parseInt(id) && role !== 'admin') {
      return res.status(400).json({ error: 'Өзіңіздің админ құқығыңызды алып тастай алмайсыз!' });
    }

    const result = await db.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, full_name, email, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пайдаланушы табылмады' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ error: 'Өзіңізді өшіре алмайсыз!' });
    }

    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пайдаланушы табылмады' });
    }

    res.json({ message: 'Пайдаланушы сәтті өшірілді', id: result.rows[0].id });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

// ─── SERVICES MANAGEMENT ───
// GET /api/admin/services is usually handled by the public /api/services route, 
// but we can add POST, PUT, DELETE here.

// POST /api/admin/services - Create new service category
router.post('/services', async (req, res) => {
  try {
    const { title, description } = req.body;
    const result = await db.query(
      'INSERT INTO services (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Қызметті қосу мүмкін емес' });
  }
});

// PUT /api/admin/services/:id - Edit service category
router.put('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const result = await db.query(
      'UPDATE services SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Табылмады' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Қызметті жаңарту мүмкін емес' });
  }
});

// DELETE /api/admin/services/:id
router.delete('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Табылмады' });
    res.json({ message: 'Өшірілді' });
  } catch (err) {
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

// ─── WORKERS MANAGEMENT ───

// GET /api/admin/workers - Get all workers with their details
router.get('/workers', async (req, res) => {
  try {
    const query = `
      SELECT w.id, w.user_id, w.service_id, w.price_range, w.average_time, w.rating,
             u.full_name, u.email, u.phone,
             s.title as service_name
      FROM workers w
      JOIN users u ON w.user_id = u.id
      JOIN services s ON w.service_id = s.id
      ORDER BY w.id DESC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching workers:', err);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

// DELETE /api/admin/workers/:id - Remove a worker profile
router.delete('/workers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the user_id for this worker to update their role back to client
    const workerRes = await db.query('SELECT user_id FROM workers WHERE id = $1', [id]);
    if (workerRes.rows.length === 0) return res.status(404).json({ error: 'Маман табылмады' });
    
    const userId = workerRes.rows[0].user_id;

    // Delete the worker record
    await db.query('DELETE FROM workers WHERE id = $1', [id]);
    
    // Revert role to 'client'
    await db.query("UPDATE users SET role = 'client' WHERE id = $1", [userId]);
    
    res.json({ message: 'Маман сәтті өшірілді' });
  } catch (err) {
    console.error('Error deleting worker:', err);
    res.status(500).json({ error: 'Сервер қатесі' });
  }
});

module.exports = router;
