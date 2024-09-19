import express from 'express';
import Parchi from '../model/Parchi.js'; // Import your Parchi model
import User from '../model/User.js'; // Make sure to import User model

const router = express.Router();

// Get all Parchis
router.get('/', async (req, res) => {
  try {
    const parchis = await Parchi.findAll({
      include: [User], // Include associated User
    });
    res.json(parchis);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parchis', error });
  }
});

// Get a single Parchi by ID
router.get('/:id', async (req, res) => {
  try {
    const parchi = await Parchi.findByPk(req.params.id, {
      include: [User], // Include associated User
    });
    if (!parchi) {
      return res.status(404).json({ message: 'Parchi not found' });
    }
    res.json(parchi);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parchi', error });
  }
});

// Create a new Parchi
router.post('/', async (req, res) => {
  try {
    const { cards, total, user_id } = req.body;
    const newParchi = await Parchi.create({
      cards,
      total,
      user_id,
    });
    res.status(201).json(newParchi);
  } catch (error) {
    res.status(500).json({ message: 'Error creating parchi', error });
  }
});

// Update a Parchi by ID
router.put('/:id', async (req, res) => {
  try {
    const { cards, total, user_id } = req.body;
    const parchi = await Parchi.findByPk(req.params.id);

    if (!parchi) {
      return res.status(404).json({ message: 'Parchi not found' });
    }

    await parchi.update({
      cards,
      total,
      user_id,
    });

    res.json(parchi);
  } catch (error) {
    res.status(500).json({ message: 'Error updating parchi', error });
  }
});

// Delete a Parchi by ID
router.delete('/:id', async (req, res) => {
  try {
    const parchi = await Parchi.findByPk(req.params.id);
    
    if (!parchi) {
      return res.status(404).json({ message: 'Parchi not found' });
    }

    await parchi.destroy();
    res.json({ message: 'Parchi deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting parchi', error });
  }
});

export default router;
