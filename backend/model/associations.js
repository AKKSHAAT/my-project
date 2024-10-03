import History from "./History.js";
import Card from "./Card.js";
import User from "./User.js";
import Parchi from "./Parchi.js";
import BuyRate from "./BuyRate.js";
import Daybill from "./Daybill.js";

// Set up associations here

Daybill.belongsTo(User, { foreignKey: "user_id", });

BuyRate.belongsTo(Card, {foreignKey: "card_id", targetKey: "id", });

Card.hasOne(BuyRate, { foreignKey: "card_id", });
Card.hasMany(History, { foreignKey: "card_id" });

User.hasMany(Daybill, { foreignKey: "user_id" });
User.hasMany(Parchi, { foreignKey: "user_id" });

Parchi.belongsTo(User, { foreignKey: "user_id" });

History.belongsTo(Card, { foreignKey: "card_id" });

export default { History, Card };
