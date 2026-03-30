require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const sequelize = require('./config/db');
require('./models'); // Sync models

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Import specific routes
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const reportRoutes = require('./routes/reports');
app.use('/auth', authRoutes);
app.use('/api', uploadRoutes);
app.use('/api/reports', reportRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ResumeIQ API is running.' });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
