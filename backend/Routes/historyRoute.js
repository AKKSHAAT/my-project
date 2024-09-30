import History from '../model/History.js';
import Card from '../model/Card.js';
import express from 'express';
import { Op } from 'sequelize';
const router = express.Router();

import { currentCardOpenTime } from '../timeService.js';
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



router.get('/history/now', async (req, res) => {
  try {
    const winningCard = await History.findOne({
      where: { cashOutTime: currentCardOpenTime.format("HH:mm")} ,
      include: { model: Card, attributes: ['name', 'number'] } // Include the Card model and only fetch the 'name'
    });

    if(winningCard) {
      res.json(winningCard);
    } else{
      res.json({messege: "winning card not out yet"})
    }
  } catch (err) {
    console.log("err",err);
    res.status(500).json({ error: 'Error fetching history' });
  }
});  



router.get('/history/before', async (req, res) => {
  try {
    const currentTime = currentCardOpenTime.format("HH:mm");
    console.log("Current Time:", currentTime); 
    // const winningCards = await History.findAll({
    //   where: {
    //     cashOutTime: { 
    //       [Op.lt]: currentTime // Use Sequelize's operators to find entries before current time
    //     }
    //   }, 
    //   include: {
    //     model: Card,
    //     attributes: ['name', 'number'] // Include the Card model and fetch 'name' and 'number'
    //   }
    // });

    const winningCards = await History.findAll({
      where: {
        cashOutTime: {
          [Op.lt]: currentTime
        } 
      },
      include: {
        model: Card,
        attributes: ['name', 'number']
      }
    });

    if (winningCards.length > 0) {
      res.json(winningCards);
    } else {
      res.json({success:false, message: "No winning cards found before the current time." });
    }
  } catch (err) {
    console.log("Error fetching history:", err);
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