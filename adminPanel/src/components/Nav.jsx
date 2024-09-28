import React from "react";
import { useNavigate } from "react-router-dom";
export const Nav = () => {
    const navigate = useNavigate(); 

  return (
    <nav className="flex justify-between px-4 items-center">
      <div>
        <h1 className="text-3xl font-bold mb-4">☎️ Tring Tring & Co</h1>
      </div>
      <button
      onClick={() => { navigate("/add") }}
        className={`px-5 py-1 text-white rounded-md hover:bg-pink-600 focus:outline-none translate-color duration-300 border`}
      >
        Add Points
      </button>
    </nav>
  );
};
