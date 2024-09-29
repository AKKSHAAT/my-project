import React, { useEffect, useState } from "react";
import Row from "./Row";
import axios from "../axios.js";
import { io } from "socket.io-client";


export const Table = () => {
  const PRICE = 11;
  const PRIZE_MULTIPLE = 10;
  const [buyRateArr, setBuyRateArr] = useState(null);
  const [socketState, setSocketState] = useState(null);

  useEffect(() => {
    const socket = io("http://192.168.227.17:6969"); // Ensure the URL and port are correct
    setSocketState(socket);
    // Listen for buy rate updates
    socket.on("buyRateUpdate", (data) => {
      console.log("data::: " , data);
      setBuyRateArr(data);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Product name
            </th>
            <th scope="col" className="px-6 py-3">
              Qty
            </th>
            <th scope="col" className="px-6 py-3">
              In {"(₹11)"}
            </th>
            <th scope="col" className="px-6 py-3">
              Out {"(₹10)"}
            </th>
            <th scope="col" className="px-6 py-3">
              difference {""}
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {buyRateArr &&
            buyRateArr.map((rate, i) => {
              const cardName = rate.Card?.name || rate.id; 
              return (
                <Row
                  card_id={rate.id}
                  key={i}
                  name={rate.name}
                  qty={rate.qty}
                  price={rate.qty * PRICE}
                  out={rate.qty * PRIZE_MULTIPLE}
                  socket={socketState}
                />
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
