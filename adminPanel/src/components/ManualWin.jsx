import React, { useState } from "react";
import useGlobalStore from "../useGlobalStore";

const ManualWin = () => {
  const { socket, updateTime, initializeSocket, setUpdateTime } =
    useGlobalStore();
  const [cardId, setCardId] = useState(""); // Initialize the state for card_id

  // Handle input change
  const handleCardIdChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // Ensure only numeric input
      setCardId(value);
    }
  };

  const handleSend = () => {
    const parsedCardId = parseInt(cardId, 10); // Convert cardId to an integer

    // Validation for empty or invalid cardId
    if (cardId === "" || parsedCardId === 0) {
      alert("Please enter a valid card ID.");
      return;
    }

    // Validation to ensure cardId is between 1 and 10
    if (cardId < 1 || cardId > 10) {
      alert("Card ID must be between 1 and 10.");
      return;
    }

    if (cardId) {
      socket.emit("win", { card_id: cardId, name: null });
      alert(`Win event sent for Card ID: ${cardId}`); // Corrected to use cardId instead of card.id
      setCardId(""); // Reset the input field
    } else {
      alert("Card ID not found in the system.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-40">
        <input
          value={cardId}
          onChange={handleCardIdChange}
          type="number"
          placeholder="Enter Card ID"
          className="w-full bg-black border-white text-white border-2 rounded px-2 mt-2"
          min="0"
        />
      </div>
      <button
        onClick={handleSend}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-xl font-medium"
      >
        Send
      </button>
    </div>
  );
};

export default ManualWin;
