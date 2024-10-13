import React, { useState } from "react";
import axios from "../axios.js";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();
  const [barcodeId, setBarcodeId] = useState("");
  const [message, setMessage] = useState("");

  const handleBarcodeInput = (event) => {
    // Assuming the barcode scanner triggers the input event
    setBarcodeId(event.target.value);
  };

  const handleCancel = async () => {
    if (!barcodeId) {
      setMessage("Please scan a barcode ID.");
      return;
    }
    try {
      const response = await axios.post(`api/parchi/${barcodeId}/cancle`);
      console.log(response);
      setMessage(response.data.message || "Parchi cancel1ed successfully.");
      const currentUser = localStorage.getItem('id');
      console.log(response.data.amount);
      const amount = response.data.amount;
      const addPointsRes = await axios.post(`api/user/${currentUser}/addpoints`, {amount: amount});
      navigate("/");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error || "Cannot cancle parchi.");
      } else {
        setMessage("Server error.");
      }
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/")}>{`<-`}</button>
      <h1>Cancel Parchi</h1>
      <input
        className="mt-1 block w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
        type="text"
        value={barcodeId}
        autoFocus 
        onChange={handleBarcodeInput}
        placeholder="Scan Barcode ID"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleCancel();
          }
        }}
      />
      <button 
        onClick={handleCancel}
        className={`px-6 py-2 text-white rounded-md hover:bg-blue-600 focus:outline-none translate-color duration-300 border`}
      >
        Cancel Parchi
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Cancel;
