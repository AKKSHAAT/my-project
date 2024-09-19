import React from "react";

const Row = ( {name, qty, price, out}) => {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {name}
      </th>

      <td className="px-6 py-4">{qty}</td>
      <td className="px-6 py-4">{price}</td>
      <td className="px-6 py-4">{out}</td>
      <td className="px-6 py-4">{price - out}</td>
      <td className="px-6 py-4">
        <button
          href="#"
          className="font-medium text-white px-4 py-2 bg-green-600 rounded-xl "
        >
          Win
        </button>
      </td>
    </tr>
  );
};

export default Row;
