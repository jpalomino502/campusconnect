import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaShoppingCart, FaEnvelope, FaBus, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose, isLoggedIn, isEmailVerified }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (isEmailVerified) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
    onClose(); // Cerrar menú después de navegar
  };

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50"
    >
      <div className="p-4 flex flex-col space-y-4">
        <button onClick={onClose} className="self-end text-gray-600" title="Cerrar Menú">
          Cerrar
        </button>
        <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-[#ff9800]" title="Publicaciones">
          <FaHome size={20} />
          <span>Publicaciones</span>
        </Link>
        <Link to="/ventas" className="flex items-center space-x-2 text-gray-600 hover:text-[#ff9800]" title="Ventas">
          <FaShoppingCart size={20} />
          <span>Ventas</span>
        </Link>
        <Link to="/messages" className="flex items-center space-x-2 text-gray-600 hover:text-[#ff9800]" title="Mensajes">
          <FaEnvelope size={20} />
          <span>Mensajes</span>
        </Link>
        <Link to="/bus" className="flex items-center space-x-2 text-gray-600 hover:text-[#ff9800]" title="Bus">
          <FaBus size={20} />
          <span>Bus</span>
        </Link>
        <button
          onClick={handleProfileClick}
          className="flex items-center space-x-2 text-gray-600 hover:text-[#ff9800]"
          title={isLoggedIn ? (isEmailVerified ? 'Perfil' : 'Iniciar Sesión') : 'Iniciar Sesión'}
        >
          <FaUser size={20} />
          <span>{isLoggedIn ? (isEmailVerified ? 'Perfil' : 'Iniciar Sesión') : 'Iniciar Sesión'}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
