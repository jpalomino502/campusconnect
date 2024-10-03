import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from 'react-bootstrap';
import universityLogo from '../../assets/logo.png'; // Asegúrate de que la ruta sea correcta

const CardModal = ({ isOpen, closeModal, userData }) => {
  const [qrValue, setQrValue] = useState('');

  // Cambia el QR cada 5 segundos (o el intervalo que desees)
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newValue = `User: ${userData.id}, Name: ${userData.displayName}`;
      setQrValue(newValue);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(intervalId);
  }, [userData]);

  return (
    <Modal show={isOpen} onHide={closeModal} backdrop="static" className="flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal} />
      <Modal.Body className="p-0">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300 max-w-md w-full"> {/* Ajuste para centrar el modal */}
          {/* Botón de cerrar modal */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-600 text-2xl z-20"
          >
            &times;
          </button>
          <div className="relative bg-[#9444e8] h-32 rounded-t-lg flex items-center justify-center overflow-hidden">
            {/* Agregar el patrón 3D con un pseudo-elemento */}
            <div className="absolute inset-0 opacity-20 pattern-3d"></div>
            {/* Línea diagonal naranja */}
            <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-full bg-orange-500 transform rotate-45 origin-top-left" style={{ width: '200%', height: '200%' }}></div>
            </div>
            <img
              src={universityLogo} // URL del logo de la universidad desde assets
              alt="Logo de la universidad"
              className="h-16 object-contain relative z-10 mb-6" // Aumentar el margen inferior para separar más el logo
            />
          </div>
          <div className="flex flex-col items-center p-4"> {/* Reducir el padding para hacerlo más delgado */}
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden relative -mt-12">
              <img
                src={userData.photoURL} // URL de la foto del usuario
                alt="Foto de usuario"
                className="w-full h-full object-cover" // Se ajusta a la imagen para evitar cortes
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mt-4">{userData.displayName}</h3>
            <p className="text-gray-600">ID: {userData.id}</p>
            <p className="text-gray-600">Carrera: {userData.career}</p>
            <div className="mt-4">
              <QRCodeSVG value={qrValue} size={128} className="transition-transform duration-500 ease-in-out transform hover:scale-110" />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CardModal;
 