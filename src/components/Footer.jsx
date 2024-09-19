import React from "react";

export const Footer = () => {
  return (
    <footer className="flex justify-start items-center border border-white p-2 mt-1 rounded-lg  text-white gap-4">
      <button
        className={`px-6 py-2 text-white rounded-md hover:bg-blue-600 focus:outline-none  translate-color duration-300 border`}
      >
        Parchi
      </button>
      <button
        className={`px-6 py-2 text-white rounded-md hover:bg-blue-600 focus:outline-none  translate-color duration-300 border`}
      >
        Bill
      </button>
      <div className="flex">
      </div>
    </footer>
  );
};
