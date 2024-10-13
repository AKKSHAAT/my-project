import React, { useEffect, useState } from "react";
import axios from "../axios.js";
import { useNavigate } from "react-router-dom";

const CancleModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [parchiId, setParchiId] = useState("");
    const [message, setMessage] = useState("");
    const [winningAmount, setWinningAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


  const close = () => {
    setParchiId("");
    setMessage("");
    setError("");
    setWinningAmount("");
    onClose();
  };

  // Handle keydown event to capture barcode input
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        if (parchiId.trim()) {
          handleCancel(); // Trigger the cashout functionality with barcode
          setParchiId(""); // Clear the barcode value after processing
        }
      } else {
        // Append key to barcodeValue as if it is being typed
        setParchiId((prev) => prev + event.key);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup event listener when modal is closed
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [parchiId, isOpen]);

  if (!isOpen) return null;

  const handleCancel = async () => {
    if (!parchiId) {
      setMessage("Please scan a barcode ID.");
      return;
    }
    try {
      const response = await axios.post(`api/parchi/${parchiId}/cancle`);
      console.log(response);
      setMessage(response.data.message || "Parchi canceled successfully.");
      
      const currentUser = localStorage.getItem('id');
      console.log(response.data.amount);
      const amount = response.data.amount;
      await axios.post(`api/user/${currentUser}/addpoints`, { amount })
        .then(res =>{
          setWinningAmount(res.data.amount);
        })

      // Close the modal and refresh the page after 2 seconds
      setTimeout(() => {
        close(); // Close the modal
        window.location.reload(); // Refresh the page
      }, 2000);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error || "Cannot cancel parchi.");
      } else {
        setMessage("Server error.");
      }
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-lg relative max-w-md w-full">
        {/* Close button */}
        <button
  onClick={close}
  className="absolute top-2 right-2 text-2xl font-bold text-white hover:text-gray-300 focus:outline-none"
>
  &times;
</button>


        <h2 className="text-2xl font-bold mb-4">Cancel</h2>
        {message && <p>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {winningAmount > 0 && <p className=" text-xl text-green-300">Winning Amount: + {winningAmount}</p>}

        {/* Display the captured barcode value */}
        <p className="text-center text-xl font-semibold mb-4 mt-3">
          {parchiId || "Enter parchi ID"}
        </p>

        {/* Cashout button */}
        <button
          onClick={() => {
            if (parchiId.trim()) {
              handleCancel(); // Trigger cashout with barcode value
              setParchiId(""); // Clear barcode after cashout
            }
          }}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Cashout
        </button>
      </div>
    </div>
  );
};

export default CancleModal;
