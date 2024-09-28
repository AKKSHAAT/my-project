import {Model, DataTypes} from 'sequelize';
import sequelize  from '../db.js';
import bcrypt from 'bcrypt';

class User extends Model {
  // Instance method to compare password
  async comparePassword(password) {
    // return bcrypt.compare(password, this.password);
    return this.password === password;
  }

  // Static method to hash password before saving
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}

User.init({
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  password: { // Add this field if it doesn't exist
    type: DataTypes.STRING,
    allowNull: false,
  },
  sales: {
    type: DataTypes.BIGINT,
    allowNull: true,
    defaultValue:0, 
  },
  points: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  sequelize,
  modelName: 'User'
});

export default User; 