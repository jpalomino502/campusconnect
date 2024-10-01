// components/NavLink.js
import React from 'react';
import { Link } from 'react-router-dom';

const NavLink = ({ to, title, isActive, children }) => {
  return (
    <div className="flex flex-col items-center relative">
      <Link to={to}>
        <button
          title={title}
          className={`${
            isActive ? 'text-[#ff9800]' : 'text-gray-700'
          } py-2 px-4 rounded-full hover:text-[#ff9800] transition duration-300`}
        >
          {children}
        </button>
      </Link>
      {isActive && <div className="absolute bottom-[-12px] h-1 w-full bg-[#ff9800] rounded-full"></div>}
    </div>
  );
};

export default NavLink;
