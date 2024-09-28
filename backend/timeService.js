import dayjs from 'dayjs';
import { extensions } from 'sequelize/lib/utils/validator-extras';
const currentTime = dayjs();
const SESSION_START = dayjs().hour(8).minute(30).second(0);
const SESSION_END = dayjs().hour(23).minute(0).second(0); 



const INTERVAL_MINUTES = 15; 
let currentCardOpenTime = SESSION_START.add(INTERVAL_MINUTES, 'minute'); // First card opens at 8:45 AM

export function checkSessionTime(req, res, next) {
  const currentTime = dayjs();
  if (currentTime.isAfter(SESSION_START) && currentTime.isBefore(SESSION_END)) {
    next(); 
  } else {
    return res.status(403).json({ message: 'Session is not active right now. Please try again between 8:30 AM and 11:00 PM.' });
  }
}

// Set an interval to check the card open time and update it automatically
const checkCardOpenTime = setInterval(() => {
  const currentTime = dayjs();
  if (currentTime.isAfter(currentCardOpenTime)) {
    // console.log(`Card opened at: ${currentCardOpenTime.format('HH:mm')}`);

    // Move to the next card's opening time
    currentCardOpenTime = currentCardOpenTime.add(INTERVAL_MINUTES, 'minute');

    // console.log(`Next card will open at: ${currentCardOpenTime.format('HH:mm')}`);
  }

  // Optionally, check if it's after session end time and stop the interval
  if (currentTime.isAfter(SESSION_END)) {
    clearInterval(`parchi: ${checkCardOpenTime.$H}, ${checkCardOpenTime.$M}`); // Stop checking after the session ends
    console.log('Session ended. No more card openings.');
  }
}, 1000); // Check every second

