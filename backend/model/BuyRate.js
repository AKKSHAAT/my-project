import {Model, DataTypes} from 'sequelize';
import sequelize  from '../db.js';
   
class BuyRate extends Model {}
//NOTE bhai ye card_id hai yaad rakhio
BuyRate.init({
  id: {
    type: DataTypes.STRING, 
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull:false,
  },
  qty: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
  cashOutTime: {
    type: DataTypes.STRING,
    allowNull: true
  },
  
}, {
  sequelize,
  modelName: 'BuyRate'
});

export default BuyRate; 