import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebaseConfig';
import NavLink from './NavLink';
import SearchBar from './SearchBar';
import MobileMenu from './MobileMenu';
import { FaBars } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setIsEmailVerified(user.emailVerified); // Verificamos si el correo ha sido verificado
      } else {
        setIsLoggedIn(false);
        setIsEmailVerified(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const isActive = (path) =>
    location.pathname === path ||
    (path === '/profile' && location.pathname === '/settings') ||
    (path === '/login' && location.pathname === '/login');

  const isLoginActive = isLoggedIn ? isActive('/profile') : isActive('/login');

  const handleProfileClick = () => {
    if (isEmailVerified) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10 w-auto cursor-pointer" />
          </Link>
          <SearchBar />
        </div>

        <nav className="hidden md:flex space-x-6">
          <NavLink to="/" title="Inicio" isActive={isActive('/')}>
            Inicio
          </NavLink>
          <NavLink to="/bus" title="Bus" isActive={isActive('/bus')}>
            Bus
          </NavLink>
          <NavLink to="/ventas" title="Ventas" isActive={isActive('/ventas')}>
            Ventas
          </NavLink>
          <NavLink to="/messages" title="Mensajes" isActive={isActive('/messages')}>
            Mensajes
          </NavLink>
          <div className="flex flex-col items-center relative">
            {isLoggedIn && isEmailVerified ? ( // Solo muestra el botón de perfil si el correo está verificado
              <button
                onClick={handleProfileClick}
                title="Perfil"
                className={`${
                  isLoginActive ? 'bg-[#ff9800] text-white' : 'bg-gray-200 text-gray-700'
                } py-2 px-4 rounded-full hover:bg-[#ff9800] hover:text-white transition duration-300`}
              >
                Perfil
              </button>
            ) : (
              <Link to="/login">
                <button
                  title="Iniciar Sesión"
                  className={`${
                    isLoginActive ? 'bg-[#ff9800] text-white' : 'bg-gray-200 text-gray-700'
                  } py-2 px-4 rounded-full hover:bg-[#ff9800] hover:text-white transition duration-300`}
                >
                  Iniciar Sesión
                </button>
              </Link>
            )}
          </div>
        </nav>

        <div className="md:hidden">
          <button
            title="Menú"
            className="text-gray-500 hover:text-[#ff9800] p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} isLoggedIn={isLoggedIn} isEmailVerified={isEmailVerified} />
    </header>
  );
};

export default Header;
