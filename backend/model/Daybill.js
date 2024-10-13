import { Model, DataTypes } from 'sequelize';
import sequelize from '../db.js';
import dayjs from 'dayjs';

class Daybill extends Model {
  getBalance() {
    return this.sales - this.expenditure;
  }

  getFormattedDate() {
    return dayjs(this.date).format('YYYY-MM-DD'); // Only date, no time
  }
}

Daybill.init({
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users', 
      key: 'id', 
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
    type: DataTypes.DATEONLY,  // Use DATEONLY to store only the date part
    defaultValue: dayjs().startOf('day').toDate(), // Today's date at 00:00:00
  }
}, {
  timestamps: true,
  sequelize,
  modelName: 'Daybill',
});

export default Daybill;
