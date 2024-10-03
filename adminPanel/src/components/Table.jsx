import React, { useEffect, useState } from "react";
import Row from "./Row";
import useGlobalStore from "../useGlobalStore"; // Import Zustand store

export const Table = () => {
  const PRICE = 11;
  const PRIZE_MULTIPLE = 10;

  const [rows, setRows] = useState([]);
  
  const { socket, updateTime, initializeSocket, setUpdateTime } = useGlobalStore(); // Use global state

  // Initialize the socket connection on mount
  useEffect(() => {
    if (!socket) {
      initializeSocket(); // Initialize socket on first load
    }

    return () => {
      if (socket) {
        socket.disconnect(); // Disconnect on unmount
      }
    };
  }, [socket, initializeSocket]);

  useEffect(() => {
    if (!socket) return; // Wait until socket is initialized

    socket.on("connect", () => {
      console.log("Socket connected!");
    });

    socket.on("buyRateUpdate", (data) => {
      setUpdateTime(new Date()); // Set update time in global state
      console.log("Received new data: ", data); // Log the incoming data

      // If rows are empty, populate them directly with data
      if (rows.length === 0) {
        setRows(data);
      } else {
        // Otherwise, merge the new data with the existing rows
        setRows((prevRows) =>
          prevRows.map((row) => {
            const updatedRow = data.find((newData) => newData.id === row.id);
            return updatedRow ? { ...row, qty: updatedRow.qty } : row;
          })
        );
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("buyRateUpdate");
    };
  }, [socket, rows, setUpdateTime]); // Add socket and rows as dependencies

  const totalQty = rows.reduce((sum, row) => sum + row.qty, 0);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {updateTime && (
        <p className="text-center font-medium p-1">
          Last Updated at: {updateTime.toLocaleTimeString()}
        </p>
      )}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Product name</th>
            <th scope="col" className="px-6 py-3 w-62"></th>
            <th scope="col" className="px-6 py-3">Qty</th>
            <th scope="col" className="px-6 py-3">In {"(₹11)"}</th>
            <th scope="col" className="px-6 py-3">Out {"(₹10)"}</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows && rows.length > 0 ? (
            rows.map((rate, i) => (
              <Row
                card_id={rate.id}
                key={i}
                name={rate.name}
                qty={rate.qty}
                totalQty={totalQty}
                price={rate.qty * PRICE}
                out={rate.qty * PRIZE_MULTIPLE}
                socket={socket} // Pass socket from the store
              />
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
