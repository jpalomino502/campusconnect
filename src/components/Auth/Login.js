import React, { useState } from 'react';
import { auth } from '../../config/firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
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

const Login = () => {
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
          console.log("Usuario verificado, redirigir a perfil");
          navigate('/profile');
        } else {
          setShowVerificationMessage(true);
        }
      } else if (view === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (user.email.endsWith('@unab.edu.co')) {
          await sendEmailVerification(user);

          await setDoc(doc(db, 'users', user.uid), {
            displayName: name,
            email: user.email,
            career: career,
            id: id,
          });

          setSuccess('Cuenta creada. Por favor verifica tu correo para completar el registro.');

          setTimeout(() => {
            resetForm();
            window.location.reload();
          }, 5000);
        } else {
          setError('El correo debe ser del dominio @unab.edu.co');
        }
      } else if (view === 'forgotPassword') {
        await auth.sendPasswordResetEmail(email);
        setSuccess('Correo de restablecimiento de contraseña enviado a ' + email);
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
      className="flex flex-col p-12 bg-white shadow-lg rounded-md relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minHeight: '600px', width: '450px' }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#ffac00] mb-6">
        {view === 'register' ? 'Registrarse' : view === 'forgotPassword' ? 'Olvidé mi Contraseña' : 'Iniciar Sesión'}
      </h2>
      <Notification error={error} success={success} showVerificationMessage={showVerificationMessage} />
      <form onSubmit={handleSubmit} className="space-y-6">
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
            className="absolute right-2 top-3 text-gray-600"
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </div>
        <Button type="submit">
          {view === 'register' ? 'Registrarse' : view === 'forgotPassword' ? 'Restablecer Contraseña' : 'Iniciar Sesión'}
        </Button>
      </form>
      <ToggleButtons view={view} toggleView={toggleView} />
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-white relative">
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
      <div className="flex items-center justify-center w-full lg:w-2/5">
        <div className="bg-white shadow-lg rounded-md relative z-10">
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default Login;
