import {Model, DataTypes} from 'sequelize';
import sequelize  from '../db.js';

class Card extends Model {}

Card.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: {
    type: DataTypes.TINYINT,
    allowNull: false,
    unique: true
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Card'
});

export default Card; 