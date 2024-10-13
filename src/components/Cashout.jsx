import React, { useState, useEffect } from 'react';
import axios from '../axios.js';
import { useNavigate } from 'react-router-dom';

const Cashout = () => {
  const navigate = useNavigate();
  const [parchiId, setParchiId] = useState('');
  const [message, setMessage] = useState('');
  const [winningAmount, setWinningAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState(''); // For storing barcode input
  const barcodeTimeout = 500; // Adjust based on scanner speed (in ms)

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleCashout();
      } else {
        setBarcodeInput((prevInput) => prevInput + event.key);
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [barcodeInput]);

  // Automatically process barcode after a period of inactivity (to simulate scan completion)
  useEffect(() => {
    if (barcodeInput) {
      const timeoutId = setTimeout(() => {
        // Set parchiId to the scanned barcode and clear barcodeInput
        setParchiId(barcodeInput);
        setBarcodeInput('');
      }, barcodeTimeout);

      return () => clearTimeout(timeoutId);
    }
  }, [barcodeInput]);

  // Handle cashout process
  const handleCashout = async () => {
    if (!parchiId) {
      setMessage('Please provide a valid parchi ID.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`api/parchi/${parchiId}/cashout`);
      if (response.data.success) {
        setMessage(response.data.message);
        setWinningAmount(response.data.winningAmount);

        if (response.data.winningAmount > 0) {
          const addedMoney = await axios.post(`api/user/${localStorage.getItem('id')}/addpoints`, {
            amount: response.data.winningAmount,
          });
          if (addedMoney.data.success) {
            navigate('/');
          }
        }
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred while cashing out.');
      }
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={() => navigate('/')}>
        {`<-`}
      </button>
      <h2>Cashout Parchi</h2>

      {/* Button to open the modal */}
      <button 
        onClick={openModal} 
        className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none transition-colors duration-300"
      >
        Cashout Parchi
      </button>

      {/* Modal */}
      <dialog >
        <div className="modal-content">
          <input
            className="mt-1 block w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
            type="text"
            value={parchiId}
            onChange={(e) => setParchiId(e.target.value)}
            placeholder="Enter Parchi ID or scan barcode"
          />
          <button 
            onClick={handleCashout} 
            disabled={loading}
            className={`mt-2 px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none transition-colors duration-300`}
          >
            {loading ? 'Processing...' : 'Cash Out'}
          </button>
          {message && <p>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {winningAmount > 0 && <p>Winning Amount: {winningAmount}</p>}

          {/* Close button */}
          <button onClick={closeModal} className="mt-4 text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md">
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default Cashout;
