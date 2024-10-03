import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

class BuyRate extends Model {}

BuyRate.init({
  card_id: {
    type: DataTypes.STRING,
    allowNull: false,
    
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qty: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  cashOutTime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'BuyRate',
  indexes: [
    {
      unique: true,
      fields: ['id', 'cashOutTime'],  // Ensures the combination of id and cashOutTime is unique
    },
  ],
});

export default BuyRate;
