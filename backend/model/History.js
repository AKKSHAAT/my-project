import {Model, DataTypes} from 'sequelize';
import sequelize  from '../db.js';

class History extends Model {}

History.init({
  card_id: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'History'
});

await sequelize.sync({ force: true })
export default History; 