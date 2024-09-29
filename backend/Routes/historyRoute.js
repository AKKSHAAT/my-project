import History from '../model/History.js';
import Card from '../model/Card.js';
import express from 'express';
const router = express.Router();

// Get all history
router.get('/history', async (req, res) => {
  try {
    const history = await History.findAll({
      include: { model: Card, attributes: ['name', 'number'] } // Include the Card model and only fetch the 'name'
    });
    res.json(history);
  } catch (err) {
    console.log("err",err);
    res.status(500).json({ error: 'Error fetching history' });
  }
});  

// Get a history by ID
router.get('/history/:id', async (req, res) => {
  try {
    const history = await History.findByPk(req.params.id);
    if (history) {
      res.json(history);
    } else {
      res.status(404).json({ error: 'history not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching history' });
  }
});

// Create a new history
router.post('/history', async (req, res) => {
  try {
    const { card_id } = req.body;  // Destructure the card_id from the request body
    const newhistory = await History.create({ card_id, cashOutTime: "8:47" }); // Pass it as an object
    console.log("added history");
    res.status(201).json(newhistory);
  } catch (err) {
    res.status(400).json({ error: 'Error creating history' });
    console.log(err);
  }
});

// Export the router
export default router;