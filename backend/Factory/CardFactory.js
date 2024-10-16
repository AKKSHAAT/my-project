import Card from "../model/Card.js";
import Parchi from "../model/Parchi.js";
import sequelize from "../db.js";
import BuyRate from "../model/BuyRate.js";
import User from "../model/User.js";
import History from "../model/History.js";
import Blacklist from "../model/Blacklist.js";
const cardFactory = async () => {
  try {
    await sequelize.sync({ force: true }); // Use { force: true } to drop and recreate tables
    console.log("Database synced.");

    // Create a new user
    await User.bulkCreate([
      { id: 123456, sales: 0, points: 10000, password: 123456, admin: 1 },
      { id: 654321, sales: 0, points: 12034, password: 123456 },
      { id: 696969, sales: 0, points: 51203, password: 123456 },
      // {id: 1, sales: 0, points: 51203, password: 1, admin: 1 },
    ]);
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
    // await BuyRate.bulkCreate([
    //   { card_id: 1, name: "Ganpati Yantra", cashOutTime:"17:45", qty:0 },
    //   { card_id: 2, name: "Gayatri Yantra", cashOutTime:"17:45", qty:0 },
    //   { card_id: 3, name: "Hanumanji Yantra", cashOutTime:"17:45", qty:0 },
    //   { card_id: 4, name: "Kalsharp Yantra", cashOutTime:"17:45",qty:0 },
    //   { card_id: 5, name: "Shani Yantra", cashOutTime:"17:45", qty:0 },
    //   { card_id: 6, name: "Shree Yantra", cashOutTime:"17:45", qty:0 },
    //   { card_id: 7, name: "Surya Yantra", cashOutTime:"17:45", qty:0 },
    //   { card_id: 8, name: "Vasikaran Yantra", cashOutTime:"17:45", qty:0 },
    //   { card_id: 9, name: "VastldoshNiwaran", cashOutTime:"17:45", qty:0 },
    //   { card_id: 10, name: "Durga Yantra", cashOutTime:"17:45", qty:0 },
    // ]);
    await Parchi.create({
      cards: [
        {
          id: 1,
          qty: 22,
          cost: 242,
          name: "lmao",
        },
        {
          id: 8,
          qty: 5,
          cost: 55,
          name: "lol",
        },
      ],
      total: 297,
      user_id: null,
      cashOutTime: "08:53",
      cashed: false,
      totalQty: 1,
    });
    await Parchi.create({
      cards: [
        {
          id: 1,
          qty: 22,
          cost: 242,
          name: "lmao",
        },
        {
          id: 8,
          qty: 5,
          cost: 55,
          name: "lol",
        },
      ],
      total: 297,
      user_id: null,
      cashOutTime: "08:53",
      cashed: false,
      totalQty: 1,
    });

    await Blacklist.create({ user_id: 1 });
    await History.bulkCreate([
      { card_id: 1, cashOutTime: "08:53" },
      { card_id: 1, cashOutTime: "09:00" },
      { card_id: 2, cashOutTime: "09:15" },
    ]);

    console.log("populated cards");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

export default cardFactory;
