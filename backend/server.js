import dns from 'dns';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import itineraryRoutes from './routes/itineraries.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded images statically
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => res.send('TravelBuddy API running'));
app.use('/api/auth', authRoutes);
app.use('/api/itineraries', itineraryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));