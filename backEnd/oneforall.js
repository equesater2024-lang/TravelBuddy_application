import dns from 'node:dns';   // or require('dns') if not fully ESM yet

dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/services/eques.db.js';
import authRoutes from './src/routes/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4000', // ← update to your React frontend URL later
  credentials: true,               // if using cookies later
}));

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend server is running (ESM mode)');
});

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Global error handler (must have 4 parameters!)
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err); // ← log the real error!
  
  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? 'Server error' : err.message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

