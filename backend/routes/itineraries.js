import express from 'express';
import auth from '../middleware/auth.js';
import Itinerary from '../models/ContentsCreated/Itinerary.js';

const router = express.Router();

// create itinerary
router.post('/', auth, async (req, res) => {
  try {
    const {
      title, destinations, startDate, endDate,
      activities, budget, notes, dailyBreakdown, isPublic
    } = req.body;

    const newItinerary = new Itinerary({
      user: req.user.id,
      title,
      destinations: Array.isArray(destinations)
        ? destinations.filter(d => d.trim())
        : (destinations ? [destinations] : []),
      startDate,
      endDate,
      activities: Array.isArray(activities)
        ? activities
        : (activities ? activities.split(',').map(a => a.trim()) : []),
      budget: Number(budget) || 0,
      notes: notes || '',
      dailyBreakdown: Array.isArray(dailyBreakdown) ? dailyBreakdown : [],
      isPublic: !!isPublic,
    });

    await newItinerary.save();
    res.status(201).json(newItinerary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// get my itineraries
router.get('/my', auth, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(itineraries);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;