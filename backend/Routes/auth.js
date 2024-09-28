// routes/auth.js
import express from 'express';
import User from '../model/User.js'; // Adjust the path as necessary
import jwt from 'jsonwebtoken';

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret'; // Change this to a strong secret key

// Login route
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' }); // Set expiresIn if you want a time limit

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Attach user info to the request
    next();
  });
};

// Logout route (optional, since JWT doesn't need server-side logout)
router.post('/logout', (req, res) => {
  // Client-side can just delete the token, no action required on server-side
  res.status(200).json({ message: 'Logout successful' });
});

export { router as authRoutes, authenticateToken }; // Export routes and middleware
