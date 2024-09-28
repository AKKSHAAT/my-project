// routes/transaction.js
import express from 'express';
import Transaction from '../model/Transaction.js'; // Adjust the path as necessary
import User from '../model/User.js'; // Adjust the path as necessary
const router = express.Router();

// Route to create a new transaction
router.post('/', async (req, res) => {
  const { userId, amount, type } = req.body;

  // Validate input
  if (!userId || !amount || !type) {
    console.log(`userId:: ${userId}, amount:: ${amount}, type::: ${type}`);
    return res.status(400).json({ error: 'User ID, amount, and type are required' });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new transaction
    const transaction = await Transaction.create({
      userId,
      amount,
      type,
    });

    return res.status(201).json({
      message: 'Transaction created successfully',
      transaction,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all transactions for a user
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Retrieve transactions for the specified user
    const transactions = await Transaction.findAll({ where: { userId } });

    if (!transactions.length) {
      return res.status(404).json({ error: 'No transactions found for this user' });
    }

    return res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get a specific transaction by ID
router.get('/transaction/:id', async (req, res) => {
  const transactionId = req.params.id;

  try {
    const transaction = await Transaction.findOne({ where: { id: transactionId } });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    return res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
