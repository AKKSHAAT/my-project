import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export const Nav = () => {
  
  const [user, setUser] = useState(localStorage.getItem('id') || "n/a")
    const navigate = useNavigate(); 
  return (
    <nav className="flex justify-between px-4 items-center">
      <div className="flex">
        <h1 className="text-3xl font-bold mb-4">☎️ Tring Tring & Co</h1>
        <p className="text-xl font-medium mb-4 px-3 py-2" >admin: {user}</p>
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
