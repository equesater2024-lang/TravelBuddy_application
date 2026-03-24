// src/services/auth.service.js
import User from '../models/user.model.js';

export class AuthService {
  static async registerUser({ username, email, password }) {
    // 1. Deeper business validation (controller already did basic required check)
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // 2. Check for existing user (by email or username — business rule)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('Email already in use');
      }
      throw new Error('Username already taken');
    }

    // 3. Create user (password hashing happens in model pre-save)
    const user = new User({ username, email, password });
    await user.save();

    // 4. You can add more heavy logic here later:
    //    - Send welcome email
    //    - Create default profile/settings
    //    - Generate verification token
    //    - etc.

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  // You can add more methods later: login, forgotPassword, etc.
}