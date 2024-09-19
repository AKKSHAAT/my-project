import "./App.css";
import axios from "./axios.js";
import Timer from "./components/Timer";
import { Nav } from "./components/Nav";
import { useEffect, useState } from "react";
import { Footer } from "./components/Footer.jsx";
import { HistoryList } from "./components/HistoryList.jsx";
import Card from "./components/Card.jsx";

import useStore from "./store/useStore.js";

function App() {

  const { cardData, setCardData } = useStore((state) => ({
    cardData: state.cardData,
    setCardData: state.setCardData,
  }));

  
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
                  <Card card={card}/>
                  <input

                    type="number"
                    className="w-32 mt-2 bg-black border-white text-white border-2 rounded px-2"
                  />
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
}

export default App;
