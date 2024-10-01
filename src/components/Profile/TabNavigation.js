// components/TabNavigation.js
import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center space-x-4 text-center mt-4">
      <button 
        onClick={() => setActiveTab('publicaciones')}
        className={`px-4 py-2 ${activeTab === 'publicaciones' ? 'border-b-4 border-orange-500' : ''}`}
      >
        Publicaciones
      </button>
      <button 
        onClick={() => setActiveTab('calculadora')}
        className={`px-4 py-2 ${activeTab === 'calculadora' ? 'border-b-4 border-orange-500' : ''}`}
      >
        Calculadora
      </button>
    </div>
  );
};

export default TabNavigation;
