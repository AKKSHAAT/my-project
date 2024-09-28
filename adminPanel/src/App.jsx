import React from "react";
import "./index.css";
import { Table } from "./components/Table";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Nav } from "./components/Nav";
import AddPoints from "./components/AddPoints";

function App() {
  return (
    <Router>
        <Nav />
      {/* <div className="container mx-auto mt-5 px-4">

        <div className="overflow-x-auto">
          <Table />
        </div>
      </div> */}


      <Routes>
        <Route path="/" element={<Table />} />
        <Route path="/add" element={<AddPoints />} />
      </Routes>
    </Router>
  );
}

export default App;
