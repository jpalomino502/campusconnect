import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebaseConfig';
import NavLink from './NavLink';
import MobileMenu from './MobileMenu';
import { FaBars } from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../../config/firebaseConfig';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [isAuthChecking, setIsAuthChecking] = useState(true); // Nuevo estado para verificar autenticación

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setIsEmailVerified(user.emailVerified);
        fetchUserData(user);
      } else {
        setIsLoggedIn(false);
        setIsEmailVerified(false);
        setPhotoURL('');
        setLoading(false); // Finaliza la carga si no hay usuario
        setIsAuthChecking(false); // Finaliza la verificación de autenticación
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (user) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setPhotoURL(user.photoURL || userData.photoURL || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false); // Asegúrate de finalizar la carga al completar la verificación
      setIsAuthChecking(false); // También finaliza la verificación de autenticación
    }
  };

  const isActive = (path) =>
    location.pathname === path ||
    (path === '/profile' && location.pathname === '/settings') ||
    (path === '/login' && location.pathname === '/login');

  const isLoginActive = isLoggedIn ? isActive('/profile') : isActive('/login');

  const handleProfileClick = () => {
    if (isLoggedIn) {
      if (isEmailVerified) {
        navigate('/profile');
      } else {
        navigate('/login');
      }
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
        </div>

        {/* Menú en pantallas grandes */}
        <nav className="hidden lg:flex space-x-6">
          <NavLink to="/" title="Inicio" isActive={isActive('/')}>Inicio</NavLink>
          <NavLink to="/bus" title="Bus" isActive={isActive('/bus')}>Bus</NavLink>
          <NavLink to="/ventas" title="Ventas" isActive={isActive('/ventas')}>Ventas</NavLink>
          <NavLink to="/messages" title="Mensajes" isActive={isActive('/messages')}>Mensajes</NavLink>
          <div className="flex flex-col items-center relative">
            {isAuthChecking ? ( // Mostrar un placeholder mientras se verifica la autenticación
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
            ) : isLoggedIn && isEmailVerified ? (
              <button
                onClick={handleProfileClick}
                title="Perfil"
                className="h-10 w-10 p-0 transition duration-300 flex items-center justify-center" // Cambia la altura y anchura del botón
              >
                {/* Mostrar imagen del perfil */}
                {loading ? (
                  <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                ) : photoURL ? (
                  <img
                    src={photoURL}
                    alt="Perfil"
                    className="h-8 w-8 rounded-full object-cover m-0" // Ajusta el tamaño de la imagen a h-8 w-8
                    style={{ objectFit: 'cover' }} // Asegura que la imagen se ajuste correctamente
                  />
                ) : (
                  <span className="text-gray-700 text-sm">Perfil</span>
                )}
              </button>
            ) : (
              <Link to="/login">
                <button
                  title="Iniciar Sesión"
                  className={`${
                    isLoginActive ? 'bg-[#ff9800] text-white' : 'bg-gray-200 text-gray-700'
                  } py-2 px-4 rounded-full transition duration-300`}
                >
                  Iniciar Sesión
                </button>
              </Link>
            )}
          </div>
        </nav>
        
        {/* Mobile Menu Icon */}
        <div className="lg:hidden">
          <button
            title="Menú"
            className="text-gray-500 hover:text-[#ff9800] p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        isEmailVerified={isEmailVerified}
      />
    </header>
  );
};

export default Header;
