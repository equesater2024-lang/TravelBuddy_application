import express from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import Post from '../models/ContentsCreated/Post.js';

const router = express.Router();

// temp fix for multer buffer - using memory storage for now
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/posts - create new post
router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    const {
      type = 'Photo', title, content,
      destination, startDate, endDate,
      activities, isPublic
    } = req.body;

    if (!title) return res.status(400).json({ msg: 'Title is required' });

    if (type === 'Photo') {
      if (!content) return res.status(400).json({ msg: 'Context is required for Photo posts' });
      if (!req.file) return res.status(400).json({ msg: 'Image is required for Photo posts' });
    } else if (type === 'Tip') {
      if (!content) return res.status(400).json({ msg: 'Content is required for Tips' });
    } else if (type === 'Itinerary') {
      if (!destination || !startDate || !endDate)
        return res.status(400).json({ msg: 'Destination and dates are required for Itineraries' });
    } else {
      return res.status(400).json({ msg: 'Invalid post type' });
    }

    // TODO: replace with cloudinary upload later
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${Date.now()}-${req.file.originalname}`;
    }

    const parsedActivities = activities
      ? activities.split(',').map(a => a.trim()).filter(Boolean)
      : [];

    const newPost = new Post({
      user: req.user.id,
      type, title, content,
      destination, startDate, endDate,
      image: imageUrl,
      activities: parsedActivities,
      isPublic: isPublic !== 'false' && isPublic !== false,
    });

    await newPost.save();
    const populated = await newPost.populate('user', 'username nickname profileIconUrl');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/posts - get all public posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ isPublic: true })
      .populate('user', 'username nickname profileIconUrl')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Get all posts error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/posts/my - only current users posts
router.get('/my', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id })
      .populate('user', 'username nickname profileIconUrl')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Get my posts error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;