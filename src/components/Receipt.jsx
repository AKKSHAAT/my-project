import axios from "../axios.js";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const Receipt = () => {
  const [receipt, setReceipt] = useState("");
  const { id } = useParams();

  async function generateReceipt() {
    const res = await axios.get(`api/parchi/make-receipt/${id}`);
    if(res.data.success) {
        // do something with the receipt
        setReceipt(res.data.receipt)

    } else if(res.data.message) {
        console.log(res.data.message);
    } else{
        console.log("receipt not found");
    }
  }


  useEffect(()=>{
    generateReceipt();
  }, []);

  return <div>{receipt}</div>;
};
