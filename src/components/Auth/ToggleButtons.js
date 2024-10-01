// components/ToggleButtons.js
import React from 'react';
import { motion } from 'framer-motion';

const ToggleButtons = ({ view, toggleView }) => {
  return (
    <div className="flex justify-center mt-6 text-sm text-gray-600">
      {view === 'login' && (
        <>
          <motion.button
            onClick={() => toggleView('register')}
            className="hover:underline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Regístrate gratis
          </motion.button>
          <motion.button
            onClick={() => toggleView('forgotPassword')}
            className="ml-4 hover:underline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Olvidé mi Contraseña
          </motion.button>
        </>
      )}
      {view === 'register' && (
        <motion.button
          onClick={() => toggleView('login')}
          className="hover:underline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Iniciar Sesión
        </motion.button>
      )}
      {view === 'forgotPassword' && (
        <>
          <motion.button
            onClick={() => toggleView('login')}
            className="hover:underline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Iniciar Sesión
          </motion.button>
          <motion.button
            onClick={() => toggleView('register')}
            className="ml-4 hover:underline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Regístrate gratis
          </motion.button>
        </>
      )}
    </div>
  );
};

export default ToggleButtons;
