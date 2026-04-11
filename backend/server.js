require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Make io accessible to our routes
app.set('io', io);

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  // Join user to a company-specific room
  socket.on('joinCompanyRoom', (companyName) => {
    if (companyName) {
      socket.join(companyName);
      console.log(`🔌 Client ${socket.id} joined room: ${companyName}`);
    }
  });

  // Handle incoming chat messages
  socket.on('chatMessage', async (data) => {
    try {
      const Message = require('./models/Message');
      const { senderId, senderName, senderAvatar, companyName, content } = data;
      
      const newMessage = await Message.create({
        senderId,
        senderName,
        senderAvatar,
        companyName,
        content
      });

      // Broadcast to everyone in the company room (including sender to confirm delivery)
      io.to(companyName).emit('newMessage', newMessage);
    } catch (err) {
      console.error('Socket chatMessage error:', err.message);
    }
  });

  socket.on('disconnect', () => console.log('👋 Client disconnected', socket.id));
});

// ── Security & parsing ──────────────────────────────────────
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── CORS — allow both frontends ─────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:5174,https://frontend-employee-taupe.vercel.app')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow if no origin (like mobile apps/curl) OR if origin is in the list
    // OR if it's ANY localhost in development mode
    // OR if it's a Vercel deployment URL
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (
      !origin || 
      allowedOrigins.includes(origin) || 
      origin.endsWith('.vercel.app') ||
      (isDevelopment && origin.includes('localhost'))
    ) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from unauthorized origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ── localtunnel bypass — prevents the "visit this page first" wall
app.use((req, res, next) => {
  res.setHeader('Bypass-Tunnel-Reminder', 'true');
  next();
});

// ── API routes ──────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/payslips', require('./routes/payslips'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/workspace', require('./routes/workspace'));

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ── 404 handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
});

// ── Error handler ───────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

// ── Database & start ────────────────────────────────────────
const PORT = process.env.PORT || 5000;

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/paradigm_shift';

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected:', uri.replace(/\/\/.*@/, '//<credentials>@'));
    return;
  } catch (err) {
    console.log('⚠️  External MongoDB not available. Trying in-memory MongoDB...');
  }

  // Fallback: in-memory MongoDB (no install needed)
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    await mongoose.connect(memUri);
    console.log('✅ In-memory MongoDB started:', memUri);
    console.warn('⚠️  CRITICAL: External MongoDB not found. Data will NOT persist after server restart.');
  } catch (memErr) {
    console.error('❌ Could not start any MongoDB service:', memErr.message);
    process.exit(1);
  }
}

connectDB().then(async () => {
  // Auto-seed if database is empty
  const User = require('./models/User');
  const count = await User.countDocuments();
  if (count === 0) {
    console.log('📦 Database is empty — running auto-seed...');
    try {
      // Inline seed using existing connection
      const seedModule = require('./seed');
      if (typeof seedModule.runSeed === 'function') {
        await seedModule.runSeed();
      }
      console.log('✅ Auto-seed complete!');
    } catch (seedErr) {
      console.warn('⚠️  Auto-seed failed:', seedErr.message);
    }
  } else {
    console.log(`📊 Database has ${count} users — skipping seed.`);
  }

  server.listen(PORT, () => {
    console.log(`🚀 Paradigm Shift API running on http://localhost:${PORT}`);
    console.log(`📋 Routes: auth, employees, tasks, leaves, expenses, documents, attendance, departments, announcements, payslips, notifications, dashboard`);
    console.log(`📡 WebSocket server is ready`);
  });
});

module.exports = app;
