import express from 'express';
import Card from '../model/Card.js'; // Import your model

const router = express.Router();

// Get all cards
router.get('/cards', async (req, res) => {
  try { 
    const cards = await Card.findAll();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching cards' });
  }
});

// Get a card by ID
router.get('/cards/:id', async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (card) {
      res.json(card);
    } else {
      res.status(404).json({ error: 'Card not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching card' });
  }
});

// Create a new card
router.post('/cards', async (req, res) => {
  try {
    const { name, number, img } = req.body;
    const newCard = await Card.create({ name, number, img });
    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ error: 'Error creating card' });
  }
});

// Update a card by ID
router.put('/cards/:id', async (req, res) => {
  try {
    const { name, number, img } = req.body;
    const card = await Card.findByPk(req.params.id);
    if (card) {
      card.name = name || card.name;
      card.number = number || card.number;
      card.img = img || card.img;
      await card.save();
      res.json(card);
    } else {
      res.status(404).json({ error: 'Card not found' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Error updating card' });
  }
});

// Delete a card by ID
router.delete('/cards/:id', async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (card) {
      await card.destroy();
      res.json({ message: 'Card deleted successfully' });
    } else {
      res.status(404).json({ error: 'Card not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error deleting card' });
  }
});

export default router;
