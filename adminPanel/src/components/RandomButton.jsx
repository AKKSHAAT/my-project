import React from "react";

export const RandomButton = () => {
  return (
    <button
      type="button"
      disabled
      class="mt-10 focus:outline-none  text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
    >
      Random winner
    </button>
  );
};
