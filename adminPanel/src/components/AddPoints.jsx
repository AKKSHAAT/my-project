// components/AddPoints.js
import React, { useState } from 'react';
import axios from '../axios'; // Adjust the import according to your axios setup

const AddPoints = () => {
  const [userId, setUserId] = useState('');
  const [userBalance, setUserBalance] = useState(null);
  const [pointsToAdd, setPointsToAdd] = useState('');
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const handleUserCheck = async () => {
    setErr('');setMsg('');
    try {
      const response = await axios.get(`/api/user/${userId}`); // Fetch user details
      console.log(response.data);
      if (response.data) {
        setMsg('user found ✅')
        setUserBalance(response.data.points); // Assume the user object has a balance property
      } else {
        setUserBalance(null);
        setErr('User not found ⛔');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setErr('Error fetching user ⚠️');
    }
  };

  const handleAddPoints = async (e) => {
    e.preventDefault();
    if (!userId || !pointsToAdd) return;

    try {
      
      const res = await axios.post(`api/user/${userId}/addpoints`, {
                    amount: pointsToAdd, 
                  });
      console.log(res.data);
      setPointsToAdd('');
      setUserBalance(null); // Reset user balance
      setMsg('points added ✅');
    } catch (error) {
      console.error('Error adding points:', error);
      setErr('Error adding points ⚠️');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-5 p-5 border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Points</h2>
      {msg && <p className='text-green-600 text-center'>{msg}</p>}
      {err && <p className='text-red-600 text-center'>{err}</p>}
      <form onSubmit={handleAddPoints}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-300">User ID</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-[#111827]"
            placeholder="Enter User ID"
          />
          <button
            type="button"
            onClick={handleUserCheck}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Check User
          </button>
        </div>
        
        {userBalance !== null && (
          <div className="mb-4">
            <p className="text-lg">User Balance: ₹{userBalance}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-200">Points to Add</label>
          <input
            type="number"
            value={pointsToAdd}
            onChange={(e) => setPointsToAdd(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md bg-[#111827]"
            placeholder="Enter points to add"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Add Points
        </button>
      </form>
    </div>
  );
};

export default AddPoints;
