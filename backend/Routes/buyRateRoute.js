import express from 'express';
import BuyRate from '../model/BuyRate.js'; // Import the BuyRate model
import { Op } from 'sequelize';
import { io } from '../index.js';


// TODO::errors are probably because of id

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
  console.log('refreshed');
};

// Clean up old entries every 15 minutes
setInterval(deleteOldEntries, 15 * 60 * 1000); // Run every 15 minutes

// Get all BuyRates
router.get('/', async (req, res) => {
  try {
    const buyRates = await BuyRate.findAll({
      include: {
        model: Card, // Include the Card model
        attributes: ['id', 'name'], // Specify the fields you want from the Card model
      }
    });
    
    // Emit buyRate to clients when HTTP request is made
    req.io.emit('buyRateUpdate', buyRates); // Make sure event name matches client-side
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

// Create or Update BuyRates
router.post('/', async (req, res) => {
  try {
    const { cards } = req.body;
    console.log(":::::::::::recived cards:::::::::::: ", cards[0]);
    const promises = cards.map(async (card) => {
      const { id, qty, name } = card;
      const existingBuyRate = await BuyRate.findOne({ where: { id } });

      if (existingBuyRate) {
        existingBuyRate.qty += qty;
        await existingBuyRate.save();
        return existingBuyRate;
      } else {
        const newBuyRate = await BuyRate.create({ id, qty , name});
        return newBuyRate;
      }
    });

    const results = await Promise.all(promises);
    req.io.emit('buyRateUpdate', results); // Ensure consistency

    res.status(201).json({results});
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: 'Error processing buy rates', error });
  }
});

// Update a BuyRate by ID
router.put('/:id', async (req, res) => {
  try {
    const { id, qty } = req.body;
    const buyRate = await BuyRate.findByPk(req.params.id);

    if (!buyRate) {
      return res.status(404).json({ message: 'BuyRate not found' });
    }

    await buyRate.update({ id, qty });
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
