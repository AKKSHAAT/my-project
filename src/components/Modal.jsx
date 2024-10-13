import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-lg relative max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl font-bold text-white hover:text-gray-300 focus:outline-none"
        >
          &times;
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
