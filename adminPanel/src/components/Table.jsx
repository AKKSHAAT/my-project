import React, { useEffect, useState } from "react";
import Row from "./Row";
import axios from "../axios.js";

export const Table = () => {
  const PRICE = 11;
  const PRIZE_MULTIPLE = 10;
  const [buyRateArr, setBuyRateArr] = useState(null);
  const getBuyRate = async () => {
    await axios
      .get("/api/buyrate")
      .then((res) => {
        setBuyRateArr(res.data);
        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getBuyRate(); // Call once on mount

    const intervalId = setInterval(() => {
      getBuyRate(); // Call every 2 seconds
    }, 2000);

    return () => clearInterval(intervalId); // Cleanup on unmount
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
              In {'(₹11)'}
            </th>
            <th scope="col" className="px-6 py-3">
              Out {'(₹10)'}
            </th>
            <th scope="col" className="px-6 py-3">
            difference {''}
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {buyRateArr &&
            buyRateArr.map((rate, i) => {
              return (
                <Row
                  key={i}
                  name={rate.card_id}
                  qty={rate.qty}
                  price={rate.qty * PRICE}
                  out={rate.qty * PRIZE_MULTIPLE}
                />
                
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
