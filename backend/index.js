import express from 'express';
import cors from 'cors';
import cardFactory from './Factory/CardFactory.js';
import cardRoutes from './Routes/cardRoutes.js';
import historyRoute from './Routes/historyRoute.js'; 
import parchiRoute from './Routes/parchiRoute.js';  
import buyRateRoute from './Routes/buyRateRoute.js';
import userRoute from './Routes/userRoute.js';
import daybillRoute from './Routes/daybillRoute.js';
import transactionRoutes from './Routes/transactionRoute.js'
import { authRoutes, authenticateToken } from './Routes/auth.js';
import { Server } from 'socket.io'; 
import './model/associations.js';
import BuyRate from './model/BuyRate.js'; 
import Card from './model/Card.js';
import History from './model/History.js';

import { checkSessionTime } from './timeService.js';


const app = express(); 
const port = process.env.PORT || 6969; 
const SESSION_START_TIME = '08:00'; // 8 AM session start time
const INTERVAL_MINUTES = 15; // Cards open every 15 minutes



// Initialize Socket.IO first
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5174", "http://127.0.0.1:5500"],
  },
});

app.use(checkSessionTime);
app.use('/api/auth', authRoutes);
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Handle WebSocket connections
io.on('connection', async (socket) => {
  console.log('A user connected:', socket.id);

  // Fetch the current BuyRate data from the database
  try {
    const buyRates = await BuyRate.findAll({
      include: {
        model: Card, // Include the Card model
        attributes: ['id', 'name'], // Specify the fields you want from the Card model
      } 
    });
    
    // Emit the current buy rate data to the newly connected client
    socket.emit('buyRateUpdate', buyRates);
    console.log("sent buyRate to client");
  } catch (error) {
    console.error('Error fetching buy rates:', error);
  }

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on('win', async (data)=>{
    console.log("winDAta: ", data);
 
    const wincard = new History({
      card_id: data.card_id
    })
    const saved = await wincard.save();
    if(saved) console.log("saved");
  })
});

// Middleware to parse JSON bodies  
cardFactory(); 
app.use(express.json());



// Sync all models 
app.use(cors());
app.use(express.json());
app.use('/api', cardRoutes); 
app.use('/api', historyRoute);   
app.use('/api/parchi', parchiRoute);
app.use('/api/buyrate', buyRateRoute); 
app.use('/api/user', userRoute); 
app.use('/api/daybill', daybillRoute);
app.use('/api/transaction', transactionRoutes);

// Define a route   
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export { io }; // Export io for use in other files
