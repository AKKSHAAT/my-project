import React, { useState } from "react";
import useParchiStore from "../store/useStore";
import axios from "../axios.js";
import Modal from "./Modal"; // Import Modal component
import {handleParchiTransaction} from '../transactionService.js'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
 
export const Footer = () => {
  const navigate = useNavigate(); 
  const PRICE = 11;
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [err, setErr] = useState(null); 
  const cards = useParchiStore((state) => state.cards);


  const getDayBill = async ()=>{
    try {
      const res = await axios.get(`api/daybill/for/${localStorage.getItem('id')}/`);
      console.log(res.data);
    } catch (err) {
      console.log(err)
    }
  }

  const openModal = async () => {
    let total = 0;
    cards.forEach(card => {
      total += (card.qty * PRICE)
    });

    if (cards.length > 0) {
      const user_id = localStorage.getItem('id');
      const parchi = {
        cards,
        total
      }
      const res = await handleParchiTransaction(parchi, user_id);
      if(res.error || res.success == false) {
        setErr('Request failed');
      } else if(res.success == true) {
        // console.log("res::   ", res);
        navigate(`/receipt/${res.parchi_id}`);
        console.log(res.messages);
      }
      
    }
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <footer className="flex justify-start items-center border border-white p-2 mt-1 rounded-lg text-white gap-4">
      <button
        onClick={openModal}
        className={`px-6 py-2 text-white rounded-md hover:bg-blue-600 focus:outline-none translate-color duration-300 border`}
      >
        Parchi
      </button>
      <button
        onClick={getDayBill}
        className={`px-6 py-2 text-white rounded-md hover:bg-blue-600 focus:outline-none translate-color duration-300 border`}
      >
        Day Bill
      </button>
      <button
        onClick={()=> navigate('/cancle')}
        className={`px-6 py-2 text-white rounded-md hover:bg-blue-600 focus:outline-none translate-color duration-300 border`}
      >
        Cancle
      </button>
      {/* Modal to display cards */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-2xl font-bold mb-4">Cards</h2>
        {err && 
          <p className="text-2xl text-red-400 font-bold">
            ⚠️ {err}
          </p>}
        {cards.length > 0 ? (
          <ul>
            {cards.map((card) => (
              <li key={card.id} className="border-b py-2">
                <strong>Card Name:</strong> {card.name}, <strong>Card No:</strong> {card.id}, <strong>Qty:</strong> {card.qty}, <strong>Price:</strong> {card.qty * PRICE}
              </li>
            ))}
          </ul>
        ) : (
          <p>No cards available</p>
        )}
      </Modal>
    </footer>
  );
};
