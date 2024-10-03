import dayjs from "dayjs";
import { extensions } from "sequelize/lib/utils/validator-extras";

export const SESSION_START = dayjs().hour(0).minute(0).second(0);
export const SESSION_END = dayjs().hour(24).minute(0).second(0);

const INTERVAL_MINUTES = 15;

export let currentCardOpenTime = SESSION_START.add(INTERVAL_MINUTES, "minute"); // First card opens at 8:45 AM
export let previousCardTime = currentCardOpenTime.subtract(INTERVAL_MINUTES, "minute");
export let nextCardOpenTime = currentCardOpenTime;

// Function to get the current time dynamically
export function getCurrentTime() {
  return dayjs(); // Return the current time whenever this function is called
}

export function countdownProvider() {
  const currentTimeForCountdown = getCurrentTime(); // Use dynamic current time

  const countdownDifference = currentCardOpenTime.diff(currentTimeForCountdown, 'seconds');

  // Convert difference into minutes and seconds
  const minutes = Math.floor(countdownDifference / 60);
  const seconds = countdownDifference % 60;

  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds; // Ensure 2-digit seconds

  // console.log(`\ncurrent time: ${currentTimeForCountdown.format("hh:mm:ss A")}`);
  // console.log(`card will open at: ${currentCardOpenTime.format("hh:mm:ss A")}`);
  // console.log(`difference : ${minutes}:${formattedSeconds}`);

  // Return formatted time as "mm:ss"
  if (countdownDifference < 10) return 0;
  return countdownDifference;
}

export function checkSessionTime(req, res, next) {
  const currentTime = getCurrentTime(); // Use dynamic current time
  if (currentTime.isAfter(SESSION_START) && currentTime.isBefore(SESSION_END)) {
    next();
  } else {
    return res.status(403).json({
      message: "Session is not active right now. Please try again between 8:30 AM and 11:00 PM.",
    });
  }
}

export function allowTransactions() {
  const currentTime = getCurrentTime(); // Use dynamic current time
  if (
    currentTime.isBefore(SESSION_START) ||
    currentTime.isAfter(SESSION_END) ||
    currentTime.isSame(SESSION_END)
  ) {
    return false;
  }
  return true;
}

// Set an interval to check the card open time and update it automatically
const checkCardOpenTime = setInterval(() => {
  const currentTime = getCurrentTime(); // Use dynamic current time in interval
  if (currentTime.isAfter(currentCardOpenTime)) {
    // Move to the next card's opening time
    currentCardOpenTime = currentCardOpenTime.add(INTERVAL_MINUTES, "minute");
    
    // Update previous and next card times
    nextCardOpenTime = currentCardOpenTime.add(INTERVAL_MINUTES, "minute");
    previousCardTime = currentCardOpenTime.subtract(INTERVAL_MINUTES, "minute");

    console.log(`\nprevious card was opened at: ${previousCardTime.format("HH:mm")}`);
    console.log(`current card will open at: ${currentCardOpenTime.format("HH:mm")}`);
    console.log(`Next card will open at: ${nextCardOpenTime.format("HH:mm")}`);
  }

  // Optionally, check if it's after session end time and stop the interval
  if (currentTime.isAfter(SESSION_END)) {
    clearInterval(checkCardOpenTime); // Stop checking after the session ends
    console.log('Session ended. No more card openings.');
  }
}, 250); // Check every second
