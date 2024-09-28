import React, {useState} from 'react'
import { useEffect } from 'react';
import axios from '../axios.js';

export const Nav = () => {
  const [user, setUser] = useState({id:"not found", points:"n/a"});

  const fetchUser = async ()=>{
    try {
      const response = await axios.get(`/api/user/${localStorage.getItem('id')}`);
      setUser(response.data); // Use response.data
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  useEffect(()=>{
    fetchUser();
  },[])

  return (
    <nav className='flex justify-between border border-white p-2 mb-1 rounded-lg '>
        <p className='pr-10'>points: {user.points}</p>
    <div className='flex justify-between'>
        <a>userID: {user.id}</a>
        
    </div>
    </nav>
  )
}
