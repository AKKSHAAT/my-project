import express from 'express';
import sequelize  from './db.js';
import Card from './model/Card.js'; 
import cors from 'cors'; 
import cardFactory from './Factory/CardFactory.js';
import cardRoutes from './Routes/cardRoutes.js';
import historyRoute from './Routes/historyRoute.js'; 
import parchiRoute from './Routes/parchiRoute.js';  
import buyRateRoute from './Routes/buyRateRoute.js'
 
import './model/associations.js';

const app = express(); 
const port = 6969 || process.env.PORT;

// Middleware to parse JSON bodies  
cardFactory(); 
// Sync all models 
app.use(cors());
app.use(express.json());
app.use('/api', cardRoutes); 
app.use('/api', historyRoute);   
app.use('/api/parchi', parchiRoute);
app.use('/api/buyrate', buyRateRoute);

// Define a route   
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
  
