// src/controllers/authController.js
import { AuthService } from '../services/authentication.service.js';

export const signup = async (req, res) => {   // ← NO next here
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newUser = await AuthService.registerUser({ username, email, password });

    return res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Signup error:', error); // ← add this for debugging

    if (error.message.includes('already')) {
      return res.status(409).json({ message: error.message });
    }

    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};