import { Model, DataTypes } from 'sequelize';
import sequelize  from '../db.js';

class Transaction extends Model {}

Transaction.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Reference to the User model
        key: 'id', // Assuming the User model has an 'id' field
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: { // For example: "add" or "subtract"
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: false, // Disable automatic timestamps if you handle them manually
  }
);

export default Transaction;
