import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
const { ipcRenderer } = window.require("electron");
import { printParchi } from "./printerUtils";
import { useNavigate } from "react-router-dom";

export const Receipt = () => {
  const navigate = useNavigate();
  const SP = 11;
  const [receipt, setReceipt] = useState({
    cards: [], // Initialize as an array to prevent errors
  });
  const { id } = useParams();
  const [printed, setPrinted] = useState(false); // Flag to prevent multiple prints

  async function generateReceipt() {
    try {
      const res = await axios.get(`api/parchi/${id}`);
      if (res.data.success) {
        console.log("response from parchi route::: ", res);
        setReceipt(res.data.parchi);
      } else if (res.data.message) {
        console.log(res.data.message);
      } else {
        console.log("Receipt not found");
      }
    } catch (error) {
      console.error("Error generating receipt:", error);
    }
  }

  // Format date to "dd-mm-yyyy"
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // "en-GB" gives the format dd/mm/yyyy
  };

  useEffect(() => {
    generateReceipt();
  }, []); // Fetch data once when the component is mounted

  // Ensure printData only gets called once, after receipt is populated
  useEffect(() => {
    if (receipt.cards.length > 0 && !printed) {
      printParchi({ ...receipt, date: formatDate(receipt.date) }); // Call printData with formatted date
      setPrinted(true); // Set flag to true after printing
      if(setPrinted) {
        navigate("/");
      }
    }
  }, [receipt, printed]); // Watch for changes in receipt and printed flag

  return (
    <>
      <div>id: {id}</div>
      <h1>Cards:</h1>
      <div>
        {receipt.cards && receipt.cards.length > 0 ? (
          receipt.cards.map((card, i) => (
            <div key={i}>
              <p>Qty: {card.qty}</p>
              <p>Name: {card.name}</p>
              <p>Total: {card.qty * SP}</p>
            </div>
          ))
        ) : (
          <p>No cards available</p>
        )}
        <p>Time: {receipt.cashOutTime}</p>
        <p>Total: {receipt.total}</p>
        {/* Show formatted date */}
        <p>Date: {formatDate(receipt.date)}</p>
      </div>
    </>
  );
};
