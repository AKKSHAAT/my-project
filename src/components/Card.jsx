import React from "react";

const Card = ({ card }) => {
  return (
    <div className="w-40 h-40 border-2 border-white flex flex-col rounded">
      <img 
        src={`/imgs/${card.name}.png`} 
        alt={card.name} 
        className="w-full h-[60%] object-cover" 
      />
      <div className="flex-1 flex flex-col justify-end font-semibold text-sm  pb-2">
        <p>{card.name}</p>
        <p className="text-blue-600">{card.number}</p>
      </div>
    </div>
  );
};

export default Card;
