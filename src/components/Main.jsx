import React from "react";
import axios from "../axios.js";
import Timer from "./Timer";
import { Nav } from "./Nav";
import { useEffect, useState } from "react";
import { Footer } from "./Footer.jsx";
import { HistoryList } from "./HistoryList.jsx";
import Card from "./Card.jsx";
import useParchiStore from "../store/useStore.js";

export const Main = () => {
  const [cardsArr, setCardsArr] = useState([]);

  const fetchCards = async () => {
    try {
      const response = await axios.get("/api/cards");
      setCardsArr(response.data); // Use response.data
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    fetchCards(); // Call fetchCards here without return
  }, []);
  return (
    <div className="">
      <Nav />
      <main className="overflow-hidden min-h-[calc(100vh-100px)]">
        <section className="grid grid-cols-4 gap-1">
          <div className="border-2 border-white rounded-lg col-span-1 h-[60dvh]">
            <Timer arr={cardsArr} />
          </div>
          <div className="border-2 border-white rounded-lg col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-4 p-2">
              {cardsArr.map((card) => (
                <div key={card.id} className="flex flex-col items-center">
                  <Card input={true} card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <HistoryList />
        <Footer />
      </main>
    </div>
  );
};
