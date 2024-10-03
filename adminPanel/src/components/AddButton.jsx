import React from "react";
import { useNavigate } from "react-router-dom";

export const AddButton = () => {
  const navigate = useNavigate(); 
  return (
    <button
      onClick={() => { navigate("/add") }}
        className={`px-5 py-1 text-white text-xl rounded-md hover:bg-pink-600 focus:outline-none translate-color duration-300 border`}
      >
        Add Points
      </button>
  );
};
