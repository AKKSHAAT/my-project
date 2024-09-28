import { Sequelize } from 'sequelize';

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'data.db', // Path to the SQLite database file
  logging: false, 
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sequelize;
 