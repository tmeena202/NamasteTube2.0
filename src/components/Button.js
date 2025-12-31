import React from "react";

const Button = ({ name, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
        isActive 
          ? "bg-black text-white" 
          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      }`}
    >
      {name}
    </button>
  );
};

export default Button;
