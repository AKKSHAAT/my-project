import {Model, DataTypes} from 'sequelize';
import sequelize  from '../db.js';

class User extends Model {}

User.init({
  user_id: {
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
  modelName: 'User'
});

export default User; 