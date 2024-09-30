// src/components/Login.js
import React, { useState } from 'react';
import axios from '../axios.js';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const nav = useNavigate();
  const [id, setid] = useState('');
  const [password, setPassword] = useState('');
  const [points, setPoints] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('api/user/create-agent-acc', {
        id, 
        password,
        points,
      });

      const data = await response.data;
      if (response.status == 200) {
        setError("created");
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-2xl text-center mb-4">Register</h2>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-white" htmlFor="id">ID:</label>
            <input
              type="text"
              id="id"
              className="mt-1 block w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
              value={id}
              onChange={(e) => setid(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-white" htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-white" htmlFor="password">Points:</label>
            <input
              type="number"
              id="number"
              className="mt-1 block w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
