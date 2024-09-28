import React, { useEffect, useState } from "react";
import axios from "../axios.js";
import Card from "./Card.jsx";

export const HistoryList = () => {
  const [historyArr, setHistoryArr] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      const res = await axios
        .get("api/history")
        .then((res) => {
          
          setHistoryArr(res.data);
        })
        
        .catch((err) => {
          console.log("err in fetching history :: ", err);
        });
    }

    fetchHistory();

    const interval = setInterval(() => {
      fetchHistory();
    }, 5000);
    return () => clearInterval(interval);

  }, []);


  return (
    <div className="border-2 border-white rounded-lg mt-1 grid gap-4 gap-y-8 p-2 h-45 overflow-x-scroll">
      <div className="flex space-x-4">
        {/* Map your elements here */}
        {historyArr.map((card, i) => (
          <Card key={i}  card={card.Card}/>
        ))}
      </div>
    </div>
  );
};
