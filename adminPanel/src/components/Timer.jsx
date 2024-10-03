import axios from "../axios.js";
import React, { useState, useEffect, useRef } from "react";

function Timer({ arr }) {
  const TIME = 900; // Total countdown time in seconds
  const [timeLeft, setTimeLeft] = useState(TIME);

  // Ref to hold the current timeLeft value
  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;

  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const response = await axios.get("/api/get-server-time");
        const serverTimeInSeconds = response.data.timeLeft;
        setTimeLeft(serverTimeInSeconds); // Update time from server
        console.log("fetched time from server: ", serverTimeInSeconds);
      } catch (error) {
        console.error("Error fetching server time:", error);
      }
    };

    fetchServerTime();
  }, []); // Fetch the server time once when the component mounts

  function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  async function saveWinner(id) {
    await axios.post("api/history", { card_id: id });
  }

  useEffect(() => {
    const timerInterval = setInterval(() => {
      // Ensure we always access the updated timeLeft
      if (timeLeftRef.current > 0) {
        setTimeLeft((prevTime) => prevTime - 1); // Decrease time by 1 second
      } else {
        console.log("Timer reached 0, resetting to 900 seconds.");
        setTimeLeft(TIME); // Reset time for the next round
      }
      // console.log("timeLeft: ", timeLeftRef.current);
    }, 1000);

    return () => clearInterval(timerInterval); // Cleanup the interval on unmount
  }, [arr, TIME]); // Add TIME as a dependency

  // Calculate minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Format seconds to always display two digits (e.g., 09, 08)
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <div className="p-2">
      <h1 className="text-2xl font-semibold">
        Time Left: {minutes}:{formattedSeconds}
      </h1>
      {timeLeft <= 0 && <h2>Time's up!</h2>}
    </div>
  );
}

export default Timer;
