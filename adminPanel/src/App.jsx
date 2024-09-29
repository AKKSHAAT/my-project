import React from "react";
import "./index.css";
import { Table } from "./components/Table";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Nav } from "./components/Nav";
import AddPoints from "./components/AddPoints";
import Timer from "./components/Timer";

function App() {
  return (
    <Router>
      <Nav />

      <main className="flex h-[calc(100vh -1)] overflow-hidden min-h-[90dvh] justify-between">
      <div className=" w-[20vw] rounded-lg h-100 bg-gray-800 flex flex-col items-center ">
        <Timer />
      </div>
        <Routes>
          <Route path="/" element={<Table />} />
          <Route path="/add" element={<AddPoints />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
