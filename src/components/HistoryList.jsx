import React, { useEffect, useState } from "react";
import axios from "../axios.js";
import Card from "./Card.jsx";

export const HistoryList = () => {
  const [historyArr, setHistoryArr] = useState([]);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      const res = await axios
        .get("api/history/before")
        .then((res) => {
          if(res.status == 200) {
            setHistoryArr(res.data);
          }else {
            setMsg("No winners!");
          }
        })
        
        .catch((err) => {
          console.log("err in fetching history :: ", err);
        });
    }

    // fetchHistory();

    const interval = setInterval(() => {
      fetchHistory();
    }, 2000);
    return () => clearInterval(interval);

  }, []);


  return (
    <div className="border-2 border-white rounded-lg mt-1 grid gap-4 gap-y-8 p-2 h-45 min-h-32 overflow-x-scroll">
      <div className="flex space-x-4">
        {/* Map your elements here */}
          {historyArr.length > 0 ?  (historyArr.map((card, i) => (
            <Card key={i}  card={card.Card} time={card.cashOutTime}/>
          )))
            : 
          (<p className="mx-auto text-3xl">{msg}</p> )
        }
      </div>
    </div>
  );
};
