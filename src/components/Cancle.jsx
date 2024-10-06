import React, { useState } from 'react';
import axios from '../axios.js';
import { useNavigate } from 'react-router-dom';


const Cancel = () => {
    const navigate = useNavigate();
  const [barcodeId, setBarcodeId] = useState('');
  const [message, setMessage] = useState('');

  const handleBarcodeInput = (event) => {
    // Assuming the barcode scanner triggers the input event
    setBarcodeId(event.target.value);
  };

  const handleCancel = async () => {
    if (!barcodeId) {
      setMessage('Please scan a barcode ID.');
      return;
    }

    try {
      const response = await axios.post(`api/parchi/${barcodeId}/cancle`);
      console.log(response);
      setMessage(response.data.message || 'Parchi canceled successfully.');
      navigate('/');
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.error || 'Cannot cancle parchi.');
      } else {
        setMessage('Server error.');
      }
    }
  };

  return (
    <div>
      <h1>Cancel Parchi</h1>
      <input
      className='mt-1 block w-full p-2 rounded border border-gray-600 bg-gray-700 text-white'
        type="text"
        value={barcodeId}
        onChange={handleBarcodeInput}
        placeholder="Scan Barcode ID"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleCancel();
          }
        }}
      />
      <button onClick={handleCancel}>Cancel Parchi</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Cancel;
