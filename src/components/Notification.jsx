import React, { useEffect, useState } from "react";

const RandomCardSelector = ({ cards }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  // Function to select a random card
  const selectRandomCard = () => {
    if (cards.length > 0) {
      const randomIndex = Math.floor(Math.random() * cards.length);
      const randomCard = cards[randomIndex];
      setSelectedCard(randomCard);
    }
  };

  // Use useEffect to set up the interval
  useEffect(() => {
    const interval = setInterval(() => {
      selectRandomCard();
    }, 250); // Select a card every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [cards]);

  return (
    <div>
      {selectedCard ? (
        <div>
          <img
            src={`/imgs/${selectedCard.name}.png`}
            alt={selectedCard.name}
            className="w-full object-cover"
          />
        </div>
      ) : (
        <div>
          <p className="text-2xl pt-10">⚠️</p>
          <p className="text-2xl text-red-400 font-bold">Cannot Reach server</p>
        </div>
      )}
    </div>
  );
};

export default RandomCardSelector;
