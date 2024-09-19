import express from 'express';
import BuyRate from '../model/BuyRate.js'; // Import the BuyRate model
import { Op } from 'sequelize';

const router = express.Router();

// Middleware to delete old BuyRate entries
const deleteOldEntries = async () => {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  await BuyRate.destroy({
    where: {
      createdAt: {
        [Op.lt]: fifteenMinutesAgo
      }
    }
  });
};

// Clean up old entries every 15 minutes
setInterval(deleteOldEntries, 15 * 60 * 1000); // Run every 15 minutes

// Get all BuyRates
router.get('/', async (req, res) => {
  try {
    const buyRates = await BuyRate.findAll();
    res.json(buyRates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching buy rates', error });
  }
});

// Get a single BuyRate by ID
router.get('/:id', async (req, res) => {
  try {
    const buyRate = await BuyRate.findByPk(req.params.id);
    if (!buyRate) {
      return res.status(404).json({ message: 'BuyRate not found' });
    }
    res.json(buyRate);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching buy rate', error });
  }
});

// Create a new BuyRate
router.post('/', async (req, res) => {
  try {
    const { card_id, qty } = req.body;
    const newBuyRate = await BuyRate.create({ card_id, qty });
    res.status(201).json(newBuyRate);
  } catch (error) {
    res.status(500).json({ message: 'Error creating buy rate', error });
  }
});

// Update a BuyRate by ID
router.put('/:id', async (req, res) => {
  try {
    const { card_id, qty } = req.body;
    const buyRate = await BuyRate.findByPk(req.params.id);

    if (!buyRate) {
      return res.status(404).json({ message: 'BuyRate not found' });
    }

    await buyRate.update({ card_id, qty });
    res.json(buyRate);
  } catch (error) {
    res.status(500).json({ message: 'Error updating buy rate', error });
  }
});

// Delete a BuyRate by ID
router.delete('/:id', async (req, res) => {
  try {
    const buyRate = await BuyRate.findByPk(req.params.id);
    
    if (!buyRate) {
      return res.status(404).json({ message: 'BuyRate not found' });
    }

    await buyRate.destroy();
    res.json({ message: 'BuyRate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting buy rate', error });
  }
});

export default router;
