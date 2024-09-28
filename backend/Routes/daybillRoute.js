import express from "express";
import Daybill from "../model/Daybill.js";
import User from "../model/User.js";

const router = express.Router();

// Route to create a new Daybill
router.post("/", async (req, res) => {
  const { user_id, sales, qty, expenditure } = req.body;

  if (
    !user_id ||
    sales === undefined ||
    qty === undefined ||
    expenditure === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new Daybill
    const daybill = await Daybill.create({
      user_id,
      sales,
      qty,
      expenditure,
    });

    return res
      .status(201)
      .json({ message: "Daybill created successfully", daybill });
  } catch (error) {
    console.error("Error creating daybill:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get all Daybills for a user
router.get("/for/:user_id", async (req, res) => {
  const userId = req.params.user_id;

  try {
    // Find all daybills for the user
    // const daybills = await Daybill.findAll({ where: { user_id: userId } });
    const daybills = await Daybill.findAll({
      where: { user_id: userId },
    });

    if (!daybills || daybills.length === 0) {
      return res.status(404).json({ error: "No daybills found for this user" });
    }

    return res.status(200).json({ daybills });
  } catch (error) {
    console.error("Error fetching daybills:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get a specific Daybill by ID
router.get("/:id", async (req, res) => {
  const daybillId = req.params.id;

  try {
    const daybill = await Daybill.findOne({ where: { id: daybillId } });

    if (!daybill) {
      return res.status(404).json({ error: "Daybill not found" });
    }

    return res.status(200).json({ daybill });
  } catch (error) {
    console.error("Error fetching daybill:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get the balance and formatted date for a specific Daybill
router.get("/:id/details", async (req, res) => {
  const daybillId = req.params.id;

  try {
    const daybill = await Daybill.findOne({ where: { id: daybillId } });

    if (!daybill) {
      return res.status(404).json({ error: "Daybill not found" });
    }

    // Get the balance and formatted date using custom getters
    const balance = daybill.getBalance();
    const formattedDate = daybill.getFormattedDate();

    return res.status(200).json({ balance, formattedDate });
  } catch (error) {
    console.error("Error fetching daybill details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
