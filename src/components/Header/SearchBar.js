// components/SearchBar.js
import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => (
  <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-2">
    <FaSearch className="text-gray-500 mr-2" />
    <input
      type="text"
      placeholder="Buscar"
      className="bg-transparent outline-none text-sm text-gray-700"
    />
  </div>
);

export default SearchBar;
