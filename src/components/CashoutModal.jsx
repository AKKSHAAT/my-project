import React, { useEffect, useState } from "react";
import axios from "../axios.js";
import { useNavigate } from "react-router-dom";

const CashoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const close = () => {
    setParchiId("");
    setMessage("");
    setError("");
    setWinningAmount("");
    onClose();
  };
  const [parchiId, setParchiId] = useState("");
  const [message, setMessage] = useState("");
  const [winningAmount, setWinningAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle keydown event to capture barcode input
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        if (parchiId.trim()) {
          handleCashout(); // Trigger the cashout functionality with barcode
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

  const handleCashout = async () => {
    if (!parchiId) {
      setMessage("Please provide a valid parchi ID.");
      return;
    }

    // setLoading(true);
    setError(null);

    try {
      console.log("parchiId:::::::::", parchiId);
      const response = await axios.post(`api/parchi/${parchiId}/cashout`);

      if (response.data.success) {
        setMessage(response.data.message);
        setWinningAmount(response.data.winningAmount);

        if (response.data.winningAmount > 0) {
          await axios
            .post(`api/user/${localStorage.getItem('id')}/addpoints`, {
              amount: response.data.winningAmount,
            })
            .then((res) => {
              setWinningAmount(res.data.amount);
            });

          // Close the modal and refresh the page after 2 seconds
          setTimeout(() => {
            close(); // Close the modal
            window.location.reload(); // Refresh the page
          }, 2000);
        }
      } else {
        setMessage(response.data.error);
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred while cashing out.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-lg relative max-w-md w-full">
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-2 right-2 text-2xl font-bold text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">Cashout</h2>
        {message && <p>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {winningAmount > 0 && (
          <p className=" text-xl text-green-300">
            Winning Amount: + {winningAmount}
          </p>
        )}

        {/* Display the captured barcode value */}
        <p className="text-center text-xl font-semibold mb-4 mt-3">
          {parchiId || "Enter parchi ID"}
        </p>

        {/* Cashout button */}
        <button
          onClick={() => {
            if (parchiId.trim()) {
              handleCashout(); // Trigger cashout with barcode value
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

export default CashoutModal;
