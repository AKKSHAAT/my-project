import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from '../axios.js'; // Adjust the import path based on your project structure

const BuyFutureParchi = () => {
  const [nextCardOpenTime, setNextCardOpenTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');

  // Fetch nextCardOpenTime from the backend on component mount
  useEffect(() => {
    const fetchNextCardOpenTime = async () => {
      try {
        const response = await axios.get('/api/get-server-time/next-card');
        const nextTime = dayjs(response.data.time); // Assuming ISO format from server
        setNextCardOpenTime(nextTime);
      } catch (error) {
        console.error('Error fetching nextCardOpenTime:', error);
      }
    };
    fetchNextCardOpenTime();
  }, []);

  // Generate time slots once nextCardOpenTime is available
  useEffect(() => {
    if (nextCardOpenTime) {
      const generateAvailableTimes = (startTime) => {
        const INTERVAL_MINUTES = 15;
        const endTime = dayjs().hour(23).minute(30); // 23:30 (11:30 PM)
        const times = [];

        let currentTime = startTime;

        while (currentTime.isBefore(endTime) || currentTime.isSame(endTime)) {
          times.push(currentTime);
          currentTime = currentTime.add(INTERVAL_MINUTES, 'minute');
        }

        setAvailableTimes(times);
      };

      generateAvailableTimes(nextCardOpenTime);
    }
  }, [nextCardOpenTime]);

  // Handle time selection
  const handleTimeSelection = (event) => {
    setSelectedTime(event.target.value);
  };

  return (
    <div className="p-6 bg-black rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Buy Future Parchi</h2>

      {availableTimes.length > 0 ? (
        <div>
          <label htmlFor="timeSelect" className="block text-lg font-medium mb-2">
            Select Time:
          </label>
          <select
            id="timeSelect"
            value={selectedTime}
            onChange={handleTimeSelection}
            className="w-full p-2 border border-gray-300 rounded mb-4 bg-white/5 text-black"
          >
            <option value="" className="bg-white/5">--Select a Time--</option>
            {availableTimes.map((time, index) => (
              <option key={index} value={time.toISOString()} className="bg-white/5">
                {time.format('HH:mm')} {/* 24-hour format */}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>Loading available times...</p>
      )}

      <button
        onClick={() => {
          if (selectedTime) {
            console.log('Selected Time:', selectedTime);
          } else {
            alert('Please select a time.');
          }
        }}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Purchase Parchi
      </button>
    </div>
  );
};

export default BuyFutureParchi;
