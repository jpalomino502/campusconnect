import React, { useRef } from 'react';
import Modal from 'react-modal';
import AvatarEditor from 'react-avatar-editor';
import { FaTimes } from 'react-icons/fa';

function ImageEditor({ isOpen, closeModal, image, onCrop, scale, setScale }) {
  const editorRef = useRef(null);  // Define the ref for the AvatarEditor

  const handleCrop = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImage().toDataURL();
      onCrop(canvas);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={closeModal} 
      contentLabel="Editor de imágenes" 
      overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
    >
      <button 
        onClick={closeModal} 
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-50"
      >
        <FaTimes className="w-6 h-6" />
      </button>
      <h2 className="text-lg font-semibold text-center mb-4">Editar Imagen</h2>
      <AvatarEditor
        ref={editorRef}
        image={image}
        width={630}  // Ancho ajustado para mantener la relación 21:9
        height={270} // Alto ajustado para mantener la relación 21:9
        border={50}
        scale={scale}
        rotate={0}
        className="mx-auto"
      />
      <input 
        type="range" 
        value={scale} 
        min="1" 
        max="2" 
        step="0.01" 
        onChange={(e) => setScale(parseFloat(e.target.value))} 
        className="my-4" 
      />
      <div className="flex justify-center space-x-4">
        <button 
          onClick={handleCrop} 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Guardar
        </button>
        <button 
          onClick={closeModal} 
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cancelar
        </button>
      </div>
    </Modal>
  );
}

export default ImageEditor;
