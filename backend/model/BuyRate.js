import {Model, DataTypes} from 'sequelize';
import sequelize  from '../db.js';

class BuyRate extends Model {}

BuyRate.init({
  card_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  qty: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'BuyRate'
});

export default BuyRate; 