const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const workersRoutes = require('./routes/workers');
const ordersRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const notificationsRoutes = require('./routes/notifications');
const messagesRoutes = require('./routes/messages');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined room user_${userId}`);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Inject io into request objects
app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());


// Маршруттар
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/workers', workersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', require('./routes/contact'));

// Auth middleware for new routes
const { verifyToken } = require('./middleware/authMiddleware');
app.use('/api/notifications', verifyToken, notificationsRoutes);
app.use('/api/messages', verifyToken, messagesRoutes);

app.get('/', (req, res) => {
  res.send('SheberTab Backend жұмыс істеп тұр!');
});

server.listen(PORT, () => {
  console.log(`Сервер http://localhost:${PORT} адресінде іске қосылды`);
});
