import jwt from 'jsonwebtoken';

export function generateToken(payload, expiresIn = '7d') {
  return new Promise((resolve, reject) => {
    jwt.sign({ user: payload }, process.env.JWT_SECRET, { expiresIn }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
}