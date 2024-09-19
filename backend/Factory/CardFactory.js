import Card from "../model/Card.js";
import Parchi from "../model/Parchi.js";
import sequelize from "../db.js";
import BuyRate from "../model/BuyRate.js";
const cardFactory = async () => {
  try {
    await sequelize.sync({ force: true }); // Use { force: true } to drop and recreate tables
    console.log("Database synced.");

    // Create a new user
    await Card.bulkCreate([
      { name: "Ganpati Yantra", number: 1, img: "lmao" },
      { name: "Gayatri Yantra", number: 2, img: "lmao" },
      { name: "Hanumanji Yantra", number: 3, img: "lmao" },
      { name: "Kalsharp Yantra", number: 4, img: "lmao" },
      { name: "Shani Yantra", number: 5, img: "lmao" },
      { name: "Shree Yantra", number: 6, img: "lmao" },
      { name: "Surya Yantra", number: 7, img: "lmao" },
      { name: "Vasikaran Yantra", number: 8, img: "lmao" },
      { name: "VastldoshNiwaran yantra", number: 9, img: "lmao" },
      { name: "Durga Yantra", number: 0, img: "lmao" },
    ]);
    await Parchi.create({
      cards: [
        {
          id: 1,
          qty: 22,
          cost: 242,
        },
        {
          id: 8,
          qty: 5,
          cost: 55,
        },
      ],
      total: 297,
      user_id: null,
      cashed: false,
    });
    
    await BuyRate.bulkCreate([
      {card_id: 1, qty: 22},
      {card_id: 2, qty: 4},
      {card_id: 5, qty: 13},
      {card_id: 6, qty: 2},
    ]);
    // Query all users
    console.log("populated cards");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

export default cardFactory;
