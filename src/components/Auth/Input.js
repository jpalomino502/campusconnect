// components/Input.js
import React from 'react';
import { motion } from 'framer-motion';

const Input = ({ type, placeholder, value, onChange, required }) => {
  return (
    <motion.input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-5 py-4 border rounded-md transition duration-200 ease-in-out hover:shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
};

export default Input;
