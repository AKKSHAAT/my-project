import axios from "../axios.js";
import React, { useState, useEffect } from "react";

function Timer({ arr }) {
  const TIME = 900;
  const [timeLeft, setTimeLeft] = useState(TIME); // Start with 15 seconds
  const [win, setWin] = useState(null);

  function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  async function saveWinner(id) {
    const res = await axios
      .post("api/history", { card_id: id })
      .then((res) => {
      })
      .catch((err) => {
        console.log("err in saving winner:: ", err);
      });
  }

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeout(() => {
        const winner = getRandomElement(arr);
        setWin(winner);
        saveWinner(winner.id);
      }, 3000);
      setTimeLeft(TIME);
    }
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1); // Decrease time by 1 second
    }, 1000);

    return () => clearInterval(timerInterval); // Cleanup the interval on unmount
  }, [timeLeft]);

  // Calculate minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Format seconds to always display two digits (e.g., 09, 08)
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <div className="p-2">
      <h1 className="text-lg font-semibold">
        Time Left: {minutes}:{formattedSeconds}
      </h1>
      {timeLeft === 0 && <h2>Time's up!</h2>}

      {win ? (
        <div className="p-10">
          <img
            src={`/imgs/${win.name}.png`}
            alt={win.name}
            className="w-full h-[60%] object-cover"
          />
          <h1 className="text-3xl py-6 font-semibold">{win.name}</h1>
          <h1 className="text-4xl font-bold text-blue-600">{win.number}</h1>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Timer;
