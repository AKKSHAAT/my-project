import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';
import dayjs from 'dayjs';

class Daybill extends Model {
  getBalance() {
    return this.sales - this.expenditure;
  }

  getFormattedDate() {
    return dayjs(this.createdAt).format('YYYY-MM-DD HH:mm:ss');
  }
}

Daybill.init({
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users', // Reference to the User model
      key: 'id', // Assuming the User model has an 'id' field
    },
  },
  sales: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  qty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  expenditure: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: true,
  sequelize,
  modelName: 'Daybill',
});

export default Daybill;
