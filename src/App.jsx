import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main } from "./components/Main.jsx";
import Login from "./components/Login.jsx";
import { Receipt } from "./components/Receipt.jsx";
import { useEffect } from "react";
import Cancel from "./components/Cancle.jsx";
import Cashout from "./components/Cashout.jsx";
import BuyFutureParchi from "./components/BuyFutureParchi.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/receipt/:id" element={<Receipt />} />
        <Route path="/cancle" element={<Cancel />} />
        <Route path="/cashout" element={<Cashout />} />
        <Route path="/BuyFuture" element={<BuyFutureParchi />} />
      </Routes>
    </Router>
  );
}

export default App;
