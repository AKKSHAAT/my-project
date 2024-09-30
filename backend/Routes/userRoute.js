// routes/user.js
import express from 'express';
import User from '../model/User.js'; // Adjust the path as necessary
import Transaction from '../model/Transaction.js'; // Import the Transaction model
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY; // Change this to a strong secret key
// Route to get user by ID


router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (user) {
      return res.status(200).json(user); // Send user details including balance
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to add points to a user


router.post('/:id/addpoints', async (req, res) => {
  const userId = req.params.id;
  let { amount } = req.body;

  // Convert amount to an integer
  amount = parseInt(amount, 10);

  // Check if amount is valid
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user's points
    user.points += amount;
    await user.save();

    // Create a transaction record
    const transaction = await Transaction.create({
      userId: user.id,
      amount: amount,
      type: 'add', // You can add more types as needed
    });

    return res.status(200).json({
      message: 'Points added successfully',
      user,
      transaction,
    });
  } catch (error) {
    console.error('Error adding points:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Login route
router.post('/login', async (req, res) => {
  const { id, password } = req.body;
  console.log(id, password);

  try {
    const user = await User.findOne({ where: { id: id } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log("SECRET_KEY", SECRET_KEY);
    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, SECRET_KEY); 

    return res.status(200).json({ message: 'Login successful', token , id:user.id});
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/create-agent-acc', async (req, res) => {
  const { id, password, points } = req.body;
  
  try {
    const user = await User.create({id, password, points});
    console.log("user created: ", user.id, user.password);
    return res.status(200).json({ message: 'userCreated'});
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to update sales and points based on total quantity
router.post('/:id/sales', async (req, res) => {
  const userId = req.params.id;
  const { total } = req.body; // Get totalQty from the request body

  // Check if totalQty is a valid number
  if (typeof total !== 'number' || total < 0) {
    return res.status(400).json({ error: 'Invalid total' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Update user's sales and points
    user.sales += total;
    user.points -= total;

    // Ensure points don't go below zero
    if (user.points < 0) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    await user.save();

    return res.status(200).json({
      message: 'Sales updated successfully',
      user: {
        id: user.id,
        sales: user.sales,
        points: user.points,
      },
    });
  } catch (error) {
    console.error('Error updating sales:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
