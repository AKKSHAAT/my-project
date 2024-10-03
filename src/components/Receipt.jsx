import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios';
const { ipcRenderer } = window.require('electron');  // Import ipcRenderer for communication

export const Receipt = () => {
  const [receipt, setReceipt] = useState('');
  const { id } = useParams();

  async function generateReceipt() {
    
    try {
      const res = await axios.get(`api/parchi/make-receipt/${id}`);
      if (res.data.success) {
        setReceipt(res.data.receipt);
        // Send receipt text to the main process for printing
        ipcRenderer.invoke('print-receipt', res.data.receipt)
          .then(response => {
            if (response.success) {
              console.log('Receipt printed successfully');
            } else {
              console.error('Failed to print receipt:', response.error);
            }
          });
      } else if (res.data.message) {
        console.log(res.data.message);
      } else {
        console.log('Receipt not found');
      }
    } catch (error) {
      console.error('Error generating receipt:', error);
    }
  }

  useEffect(() => {
    generateReceipt();
  }, []);

  return <div>{receipt}</div>;
};
