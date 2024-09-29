import {Model, DataTypes} from 'sequelize';
import sequelize  from '../db.js';

class History extends Model {
  getFormattedDate() {
    return dayjs(this.createdAt).format('YYYY-MM-DD');
  }
}

History.init({
  card_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cashOutTime: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'History'
});

await sequelize.sync({ force: true })
export default History; 