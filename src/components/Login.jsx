// src/components/Login.js
import React, { useState } from 'react';
// import axios from '../axios.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  // const route = 'https://my-project-cii4.onrender.com/api/user/login';
  const route = 'http://localhost:6969';
  const nav = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(route, {
        id: userId, 
        password
      });

      const data = await response.data;
      if (response.status == 200) {
        console.log('Login successful:', data);
        localStorage.setItem("auth", data.token);
        localStorage.setItem("id", data.id);
        nav('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-2xl text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-white" htmlFor="userId">User ID:</label>
            <input
              type="text"
              id="userId"
              className="mt-1 block w-full p-2 rounded border border-gray-600 bg-gray-700 text-white"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
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
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
