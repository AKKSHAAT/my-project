import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';

class Parchi extends Model {}

Parchi.init({
  cards: {
    type: DataTypes.JSON, // Use JSON to store an array of objects
    allowNull: false,
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('Cards should be an array');
        }
      }
    }
  },
  total: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    validate: {
      min: 0, 
    },
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cashed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  modelName: 'Parchi'
});

export default Parchi;
