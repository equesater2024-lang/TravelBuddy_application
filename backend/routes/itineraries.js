import express from 'express';
import auth from '../middleware/auth.js';
import Itinerary from '../models/ContentsCreated/Itinerary.js';

const router = express.Router();

const VALID_STATUSES = ['Draft', 'Published', 'Completed'];

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

    if (req.body.status && !VALID_STATUSES.includes(req.body.status))
    return res.status(400).json({ msg: 'Invalid status value' });
    if (!title) return res.status(400).json({ msg: 'Title is required' });
    if (!startDate || !endDate) return res.status(400).json({ msg: 'Start and end dates are required' });

    await newItinerary.save();
    res.status(201).json(newItinerary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// update itinerary
router.put('/:id', auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) return res.status(404).json({ msg: 'Itinerary not found' });
    if (itinerary.user.toString() !== req.user.id)
      return res.status(403).json({ msg: 'Not authorized' });

    const {
      title, destinations, startDate, endDate,
      activities, budget, notes, dailyBreakdown, isPublic
    } = req.body;

    if (title) itinerary.title = title;
    if (destinations) itinerary.destinations = Array.isArray(destinations)
      ? destinations.filter(d => d.trim()) : [destinations];
    if (startDate) itinerary.startDate = startDate;
    if (endDate) itinerary.endDate = endDate;
    if (activities !== undefined) itinerary.activities = Array.isArray(activities)
      ? activities : (activities ? activities.split(',').map(a => a.trim()) : []);
    if (budget !== undefined) itinerary.budget = Number(budget);
    if (notes !== undefined) itinerary.notes = notes;
    if (dailyBreakdown !== undefined) itinerary.dailyBreakdown =
      Array.isArray(dailyBreakdown) ? dailyBreakdown : [];
    if (isPublic !== undefined) itinerary.isPublic = !!isPublic;

    await itinerary.save();
    res.json(itinerary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// delete itinerary
router.delete('/:id', auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) return res.status(404).json({ msg: 'Itinerary not found' });
    if (itinerary.user.toString() !== req.user.id)
      return res.status(403).json({ msg: 'Not authorized' });

    await itinerary.deleteOne();
    res.json({ msg: 'Itinerary deleted' });
  } catch (err) {
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