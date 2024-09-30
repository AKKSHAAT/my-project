import {Model, DataTypes} from 'sequelize';
import sequelize  from '../db.js';

class Blacklist extends Model {}
//NOTE bhai ye card_id hai yaad rakhio
Blacklist.init({
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  timestamps: true,
  modelName: 'Blacklist'
});

export default Blacklist; 