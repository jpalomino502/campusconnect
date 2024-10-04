import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../config/firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { motion } from 'framer-motion';
import loginImage from '../../assets/login.svg';
import Input from './Input';
import Button from './Button';
import ToggleButtons from './ToggleButtons';
import CareerSelect from './CareerSelect';
import Notification from './Notification';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [career, setCareer] = useState('');
  const [id, setId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [view, setView] = useState('login');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const navigate = useNavigate();

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const generateDefaultProfileImage = (email) => {
    const backgroundColor = getRandomColor();
    const initial = email.charAt(0).toUpperCase();

    return { background: backgroundColor, initial };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowVerificationMessage(false);

    const idPattern = /^U\d{8}$/;
    if (view === 'register' && !idPattern.test(id)) {
      setError('El ID debe tener el formato U00000000');
      return;
    }

    try {
      if (view === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user.emailVerified) {
          navigate('/profile');
        } else {
          setShowVerificationMessage(true);
        }
      } else if (view === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user.email.endsWith('@unab.edu.co')) {
          await sendEmailVerification(user);

          const { background, initial } = generateDefaultProfileImage(user.email);

          await setDoc(doc(db, 'users', user.uid), {
            displayName: name,
            email: user.email,
            career: career,
            id: id,
            photoURL: `https://via.placeholder.com/150/${background.replace('#', '')}/FFFFFF/?text=${initial}`,
          });

          setSuccess('Cuenta creada. Por favor verifica tu correo para completar el registro.');

          Swal.fire({
            title: '¡Cuenta creada!',
            text: 'Por favor verifica tu correo para completar el registro.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then((result) => {
            if (result.isConfirmed) {
              resetForm();
              window.location.reload();
            }
          });
        } else {
          setError('El correo debe ser del dominio @unab.edu.co');
        }
      } else if (view === 'forgotPassword') {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Correo de restablecimiento de contraseña enviado a ' + email + '. Revisa tu bandeja de entrada.');
        setEmail('');
      }
    } catch (err) {
      console.error(err);
      setError(view === 'register' ? 'Error al registrar usuario' : 'Credenciales incorrectas');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setCareer('');
    setId('');
  };

  const toggleView = (view) => {
    setView(view);
    setError('');
    setSuccess('');
    setShowVerificationMessage(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderView = () => (
    <motion.div
      className="flex flex-col p-6 md:p-12 bg-white shadow-lg rounded-md relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: '400px', width: '100%', maxWidth: '450px' }}
    >
      <h2 className="text-2xl md:text-4xl font-bold text-center text-[#ffac00] mb-6">
        {view === 'register' ? 'Registrarse' : view === 'forgotPassword' ? 'Olvidé mi Contraseña' : 'Iniciar Sesión'}
      </h2>
      <Notification error={error} success={success} showVerificationMessage={showVerificationMessage} />
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {view === 'register' && (
          <>
            <Input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="ID (formato U00000000)"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
            <CareerSelect career={career} setCareer={setCareer} />
          </>
        )}
        <Input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {view !== 'forgotPassword' && (
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
        )}
        <Button type="submit">
          {view === 'register' ? 'Registrarse' : view === 'forgotPassword' ? 'Restablecer Contraseña' : 'Iniciar Sesión'}
        </Button>
      </form>
      <ToggleButtons view={view} toggleView={toggleView} />
    </motion.div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <div
        className="hidden lg:flex lg:w-3/5 bg-cover"
        style={{
          backgroundImage: `url(${loginImage})`,
          backgroundSize: '70%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
        }}
      />
      <div className="flex items-center justify-center w-full lg:w-2/5 p-6 md:p-12">
        <div className="bg-white shadow-lg rounded-md relative z-10">
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default Login;
