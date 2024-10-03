import React, { useState } from "react";

const Row = ({ card_id, name, qty, totalQty, price, out, socket }) => {
  const [manualWin , setManualWin] = useState('');
  const handleClick = () => {
    socket.emit("win", { card_id, name });
    console.log(socket);
  };
  // Calculate the percentage
  const percentage = totalQty ? (qty / totalQty) * 100 : 0;

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {card_id}. {name}
      </th>

      <td scope="col" className="px-6 py-3 w-60">
        <div className="relative w-full bg-gray-200 rounded-full h-2">
          <div
            className="absolute top-0 left-0 h-2 bg-green-600 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-600">{percentage.toFixed(2)}%</span> {/* Display percentage */}
      </td>
      <td className="px-6 py-4">{qty}</td>
      <td className="px-6 py-4">{price}</td>
      <td className="px-6 py-4">{out}</td>
      <td className="px-6 py-4">
        <button
          onClick={handleClick}
          className="font-medium text-white px-4 py-2 bg-green-600 rounded-xl"
        >
          Win
        </button>
      </td>
    </tr>
  );
};

export default Row;
