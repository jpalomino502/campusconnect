import React from 'react';

const Notification = ({ error, success, showVerificationMessage }) => {
  return (
    <>
      {(error || success) && (
        <p className={`text-center mb-4 ${error ? 'text-red-500' : 'text-green-500'}`}>
          {error || success}
        </p>
      )}
      {showVerificationMessage && (
        <p className="text-red-500 text-center mb-4">
          Por favor revisa tu bandeja de entrada y verifica tu cuenta.
        </p>
      )}
    </>
  );
};

export default Notification;
