import React, { useState, useEffect } from "react";
import useParchiStore from "../store/useStore";

const Card = ({ card, input = false , time=null}) => {
  const parchi = useParchiStore.getState();

  // Initialize with existing card qty or default to an empty string
  const [qty, setQty] = useState(card.qty || "");

  // Handle input change and update qty
  const handleQtyChange = (e) => {
    const value = e.target.value;
    
    // Allow only numeric values or an empty string
    if (/^\d*$/.test(value)) {
      const newQty = value === "" ? "" : parseInt(value, 10);
      setQty(newQty); // Update the local qty state

      // Check if the card exists in the cards array
      const existingCard = parchi.cards.find((c) => c.id === card.id);

      if (existingCard) {
        if (newQty === 0 || value === "") {
          // If the new quantity is 0 or empty, remove the card
          parchi.removeCard(card.id);
        } else {
          // If the card exists and newQty is not 0, update its qty and name
          parchi.updateCard(card.id, newQty, card.name);
        }
      } else if (newQty > 0) {
        // If the card doesn't exist and newQty is positive, add it
        parchi.addCard({ id: card.id, qty: newQty, name: card.name });
      }
    }
  };

  useEffect(() => {
    setQty(card.qty || ""); // Update qty if card changes
  }, [card.qty]); // Trigger when card qty changes

  return (
    <>
      <div className="w-40 h-40 border-2 border-white flex flex-col rounded">
        <img
          src={`/imgs/${card.name}.png`}
          alt={card.name}
          className="w-full h-[60%] object-cover"
        />
        <div className="flex-1 flex flex-col justify-end font-semibold text-sm pb-2">
          <p>{card.name}</p>
          <p className="text-blue-600">{card.number}</p>
      {time ? <p className="text-white bg-black">Time: {time}</p> : ""}
        </div>
      </div>
      {input ? (
        <input
          value={qty}
          onChange={handleQtyChange}
          type="number"
          className="w-32 mt-2 bg-black border-white text-white border-2 rounded px-2"
          min="0"
        />
      ) : null}
    </>
  );
};

export default Card;
