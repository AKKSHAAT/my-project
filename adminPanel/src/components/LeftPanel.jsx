import React, {useState} from 'react'
import { AddButton } from "./AddButton";
import Timer from "./Timer";
import { useNavigate } from 'react-router-dom';
import ManualWin from './ManualWin';

export const LeftPanel = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(localStorage.getItem('id') || "n/a")
  return (
    <div className=" w-[20vw] rounded-lg h-100 bg-gray-800 flex flex-col items-center gap-4 py-2">
        <h1 onClick={() => { navigate("/") }} className="text-3xl font-bold mb-4 cursor-pointer pt-3">☎️ Tring Tring & Co</h1>
        <p className="text-xl font-medium mb-4 px-3 text-pink-600" >Admin ID: <span className=' text-white'>{user}</span></p>
        <Timer />
        <AddButton />
        <ManualWin />
      </div>
  )
}
