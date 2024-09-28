import express from 'express';
import Parchi from '../model/Parchi.js'; // Adjust the path as necessary
import User from '../model/User.js'; // Assuming you need to associate the parchi with a user
import dayjs from 'dayjs';

const router = express.Router();

function calculateTotalQty(cards) {
  // Initialize total quantity to zero
  let totalQty = 0;

  // Check if cards is an array
  if (Array.isArray(cards)) {
    // Iterate through each card and sum up the quantities
    cards.forEach(card => {
      // Ensure the qty field exists and is a number
      if (card.qty && typeof card.qty === 'number') {
        totalQty += card.qty;
      }
    });
  } else {
    throw new Error('Invalid input: cards should be an array');
  }

  return totalQty;
}

// Route to create a new Parchi
router.post('/', async (req, res) => {
  const { cards, total, user_id } = req.body;

  if (!Array.isArray(cards) || cards.length === 0) {
    return res.status(400).json({ error: 'Cards should be a non-empty array' });
  }

  if (!total || total < 0) {
    return res.status(400).json({ error: 'Invalid total value' });
  }

  try {
    // Create a new parchi record
    const parchi = await Parchi.create({
      cards,
      total,
      user_id,
      totalQty: calculateTotalQty(cards)
    });

    return res.status(201).json({ message: 'Parchi created successfully', parchi });
  } catch (error) {
    console.error('Error creating parchi:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all Parchis
router.get('/', async (req, res) => {
  try {
    const parchis = await Parchi.findAll({
      include: [{ model: User, attributes: ['id', 'points', 'sales'] }], // Fetch related user data
    });
    return res.status(200).json(parchis);
  } catch (error) {
    console.error('Error fetching parchis:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to cash out a parchi
router.post('/:id/cashout', async (req, res) => {
  const parchiId = req.params.id;

  try {
    const parchi = await Parchi.findByPk(parchiId);

    if (!parchi) {
      return res.status(404).json({ error: 'Parchi not found' });
    }

    if (parchi.cashed) {
      return res.status(400).json({ error: 'Parchi is already cashed out' });
    }

    // Update the parchi as cashed out
    parchi.cashed = true;
    await parchi.save();

    // Optionally update the user's points
    if (parchi.user_id) {
      const user = await User.findOne({ where: { id: parchi.user_id } });
      if (user) {
        user.points += parchi.total;
        await user.save();
      }
    }

    return res.status(200).json({ message: 'Parchi cashed out successfully', parchi });
  } catch (error) {
    console.error('Error cashing out parchi:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get a single Parchi by ID
router.get('/:id', async (req, res) => {
  const parchiId = req.params.id;

  try {
    const parchi = await Parchi.findByPk(parchiId, {
      include: [{ model: User, attributes: ['id', 'points', 'sales'] }],
    });

    if (!parchi) {
      return res.status(404).json({ error: 'Parchi not found' });
    }

    return res.status(200).json(parchi);
  } catch (error) {
    console.error('Error fetching parchi:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
