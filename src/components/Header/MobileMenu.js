import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaBus, FaUser, FaTimes } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose, isLoggedIn, isEmailVerified }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path; // Comprobar si la ruta es activa

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (isEmailVerified) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      )}

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-4 flex flex-col"
      >
        <button 
          onClick={onClose} 
          className="text-gray-600 text-lg font-semibold mb-4"
          title="Cerrar Menú"
        >
          <FaTimes size={24} />
        </button>
        <div className="flex flex-col space-y-4">
          <Link to="/" className={`flex items-center space-x-3 text-lg ${isActive('/') ? 'text-[#ff9800]' : 'text-gray-600 hover:text-[#ff9800]'}`} title="Publicaciones">
            <FaHome size={24} />
            <span>Publicaciones</span>
          </Link>
          <Link to="/bus" className={`flex items-center space-x-3 text-lg ${isActive('/bus') ? 'text-[#ff9800]' : 'text-gray-600 hover:text-[#ff9800]'}`} title="Bus">
            <FaBus size={24} />
            <span>Bus</span>
          </Link>
          <Link to="/servicios" className={`flex items-center space-x-3 text-lg ${isActive('/servicios') ? 'text-[#ff9800]' : 'text-gray-600 hover:text-[#ff9800]'}`} title="Servicios"> {/* Aquí se agrega el enlace de Servicios */}
            <FaUser size={24} />
            <span>Servicios</span>
          </Link>
          <button
            onClick={handleProfileClick}
            className={`flex items-center space-x-3 text-lg ${
              isActive('/profile') ? 'text-[#ff9800] border-b-2 border-[#ff9800]' : (isActive('/login') && !isLoggedIn ? 'text-[#ff9800]' : 'text-gray-600 hover:text-[#ff9800]')
            }`}
            title={isLoggedIn ? (isEmailVerified ? 'Perfil' : 'Iniciar Sesión') : 'Iniciar Sesión'}
          >
            <FaUser size={24} />
            <span>{isLoggedIn ? (isEmailVerified ? 'Perfil' : 'Iniciar Sesión') : 'Iniciar Sesión'}</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default MobileMenu;
