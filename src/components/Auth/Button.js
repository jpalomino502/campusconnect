// components/Button.js
import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ type, onClick, children }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className="w-full px-4 py-4 font-bold text-white bg-[#ff9800] rounded-md transition duration-200 ease-in-out hover:shadow-lg"
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
