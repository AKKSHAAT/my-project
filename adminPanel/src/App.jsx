import React from 'react';
import './index.css';
import { Table } from './components/Table';

function App() {
  return (
    <div className="container mx-auto mt-5 px-4">
      <h1 className="text-3xl font-bold text-center mb-4">☎️ Tring Tring & Co</h1>
      
      <div className="overflow-x-auto">
        <Table />
      </div>
    </div>
  );
}

export default App;
