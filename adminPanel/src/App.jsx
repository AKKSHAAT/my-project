import React, {useState} from "react";
import "./index.css";
import { Table } from "./components/Table";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Nav } from "./components/Nav";
import Register from "./components/Register";
import AddPoints from "./components/AddPoints";
import Login from './components/Login';
import { LeftPanel } from "./components/LeftPanel";


function App() {
  
  return (
    <Router>
      <Nav />

      <main className="flex h-[calc(100vh -1)] overflow-hidden min-h-[90dvh] justify-between">
        <LeftPanel />
        <Routes>
          <Route path="/" element={<Table />} />
          <Route path="/add" element={<AddPoints />} />
          <Route path="/create-agent-acc" element={<Register />} />
          <Route path="/set-admin" element={<Login />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
