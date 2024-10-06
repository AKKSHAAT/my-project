import express from "express";
import Parchi from "../model/Parchi.js"; // Adjust the path as necessary
import User from "../model/User.js"; // Assuming you need to associate the parchi with a user
import Card from "../model/Card.js"
import dayjs from "dayjs";
import History from "../model/History.js";
import { checkSessionTime, nextCardOpenTime, currentCardOpenTime } from "../timeService.js";
import sequelize from "../db.js";
import { Op, where } from "sequelize";
import { authMiddleware } from "../auth.js";
import {generateReceipt} from '../parchiUtils.js';

const WINNING_MULTIPLE = 10;
const router = express.Router();

// router.use(authMiddleware); 

function calculateTotalQty(cards) {
  // Initialize total quantity to zero
  let totalQty = 0;

  // Check if cards is an array
  if (Array.isArray(cards)) {
    // Iterate through each card and sum up the quantities
    cards.forEach((card) => {
      // Ensure the qty field exists and is a number
      if (card.qty && typeof card.qty === "number") {
        totalQty += card.qty;
      }
    });
  } else {
    throw new Error("Invalid input: cards should be an array");
  }

  return totalQty;
}

// Route to create a new Parchi
router.post("/",checkSessionTime , async (req, res) => {
  const { cards, total, user_id } = req.body;
  console.log(user_id);
  if (!Array.isArray(cards) || cards.length === 0) {
    return res.status(400).json({ error: "Cards should be a non-empty array" });
  }

  if (!total || total < 0) {
    return res.status(400).json({ error: "Invalid total value" });
  }

  try {
    // Create a new parchi record
    const parchi = await Parchi.create({
      cards,
      total,
      user_id,
      cashOutTime: currentCardOpenTime.format("HH:mm"),
      totalQty: calculateTotalQty(cards),
    });

    return res
      .status(201)
      .json({ message: "Parchi created successfully", parchi });
  } catch (error) {
    console.error("Error creating parchi:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});




router.post("/future",checkSessionTime , async (req, res) => {
  const { cards, total, user_id, cashOutTime} = req.body;
  console.log(user_id);
  if (!Array.isArray(cards) || cards.length === 0) {
    return res.status(400).json({ error: "Cards should be a non-empty array" });
  }

  if (!total || total < 0) {
    return res.status(400).json({ error: "Invalid total value" });
  }

  try {
    // Create a new parchi record
    const parchi = await Parchi.create({
      cards,
      total,
      user_id,
      cashOutTime,
      totalQty: calculateTotalQty(cards),
    });

    return res
      .status(201)
      .json({ message: "Parchi created successfully", parchi });
  } catch (error) {
    console.error("Error creating parchi:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// Route to get all Parchis
router.get("/", async (req, res) => {
  try {
    const parchis = await Parchi.findAll({
      include: [{ model: User, attributes: ["id", "points", "sales"] }], // Fetch related user data
    });
    return res.status(200).json(parchis);
  } catch (error) {
    console.error("Error fetching parchis:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to cash out a parchi
router.post("/:id/cashout",checkSessionTime ,async (req, res) => {
  const parchiId = req.params.id;

  try {
    const parchi = await Parchi.findByPk(parchiId);
    if (!parchi) {
      return res.status(404).json({ error: "Parchi not found" });
    }

    if (parchi.cashed) {
      return res.status(400).json({ error: "Parchi is already cashed out" });
    }

    const queryDate = "2024-09-28";

    const parchiDate = dayjs(parchi.createdAt).format("YYYY-MM-DD");
    const history = await History.findOne({
      where: { 
        createdAt: {
          [Op.gte]: dayjs(parchiDate).startOf("day").toDate(), // Start of the day
          [Op.lt]: dayjs(parchiDate).endOf("day").toDate(), // End of the day
        },
        cashOutTime: parchi.cashOutTime, // Matching cashOutTime
      },
    });
    console.log("history:", history.card_id);

    // match ids here
    const cardIds = parchi.cards.map(card => card.id);
    console.log("cardIds: ", cardIds);
    console.log("history.card_id: ", history.card_id);

    const winningCards = [];
    for (const card of parchi.cards) { 
      console.log('card.id: ', card.id);
      if (card.id == history.card_id) {
        console.log('match');
        winningCards.push(card); 
      }
    }

    // Update the parchi as cashed out
    parchi.cashed = true;
    await parchi.save(); 

    // send winning total to client
    if(winningCards.length > 0) {
      let winningAmount = 0;

      winningCards.map(card=>{
        winningAmount = card.qty*WINNING_MULTIPLE;
      });

      if (parchi.user_id) { //add winning amout to user points
        const user = await User.findOne({ where: { id: parchi.user_id } });
        if (user) {
          user.points += winningAmount;
          await user.save();
        }
      }
      // send winning amout
      return res
      .status(200)
      .json({ message: "Parchi cashed out successfully", winningAmount });
    }
  

    return res
      .status(200)
      .json({ message: "Parchi cashed out successfully", winningAmount: 0 });
  } catch (error) {
    console.error("Error cashing out parchi:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/:id/cancle", checkSessionTime, async (req, res) => {
  const { id } = req.params; // Extract the parchi ID from the request parameters
  try {
    // Step 1: Find the parchi to be deleted
    const parchiToDelete = await Parchi.findByPk(id);
    if (!parchiToDelete) {
      return res.status(404).json({ error: "Parchi not found" });
    }

    // Step 2: Check if there are any newer parchis
    const hasNewerParchis = await Parchi.findOne({
      where: {
        createdAt: {
          [Op.gt]: parchiToDelete.createdAt // Check if there are any parchis created after the one to be deleted
        },
      },
    });

    // Step 3: If no newer parchis exist, delete the parchi
    if (!hasNewerParchis) {
      await Parchi.destroy({ where: { id } }); // Delete the parchi
      return res.status(200).json({ message: "Parchi deleted successfully" });
    } else {
      return res.status(400).json({ error: "Cannot delete parchi, a newer parchi exists" });
    }
  } catch (error) {
    console.error("Error deleting parchi:", error);
    return res.status(500).json({ error: "Server error" });
  }
});


// Route to get a single Parchi by ID
router.get("/:id", async (req, res) => {
  const parchiId = req.params.id;

  try {
    const parchi = await Parchi.findByPk(parchiId, {
      include: [{ model: User, attributes: ["id", "points", "sales"] }],
    });

    if (!parchi) {
      return res.status(404).json({success: false , error: "Parchi not found" });
    }
    console.log(parchi.getFormattedDate());
    parchi.date = parchi.getFormattedDate();
    return res.status(200).json({success: true ,parchi});
  } catch (error) {
    console.error("Error fetching parchi:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



  router.get("/make-receipt/:id", async (req, res) => {
    const parchiId = req.params.id;
    try {
      const parchi = await Parchi.findByPk(parchiId);
      console.log("parchi:: ", parchi, "parchiId:: ", parchiId);

      if (!parchi) return res.status(404).json({ error: "Parchi not found" });

      const receipt = generateReceipt(parchi);
      return res.status(200).json({success: true, receipt}); 
    } catch (error) {
      console.error("Error fetching parchi:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });



export default router;
