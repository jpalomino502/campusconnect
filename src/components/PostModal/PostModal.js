import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaTimes, FaImage, FaVideo, FaUpload } from 'react-icons/fa';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext'; // Importar el contexto de autenticación

Modal.setAppElement('#root');

const PostModal = ({ isOpen, closeModal }) => {
  const { user } = useAuth(); // Obtener el usuario del contexto
  const [postContent, setPostContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedFiles);
  };

  const handleUpload = async (file, folder) => {
    if (!user || !user.uid) { // Asegurarse que user y user.uid existan
      setError("El usuario no está autenticado.");
      return null; // Salir si no hay usuario
    }

    const imageRef = ref(storage, `user/${user.uid}/posts/${folder}/${file.name}_${Date.now()}`);
    try {
      await uploadBytes(imageRef, file);
      return await getDownloadURL(imageRef);
    } catch (uploadError) {
      console.error("Error al subir el archivo:", uploadError);
      setError("Error al subir el archivo.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores al enviar

    if (!user || !user.uid) {
      setError("El usuario no está autenticado."); // Manejo de error si el usuario no está autenticado
      return; // Salir si no hay usuario
    }

    const mediaUrls = [];

    for (const file of mediaFiles) {
      const url = await handleUpload(file, file.type.startsWith('image/') ? 'images' : 'videos');
      if (url) {
        mediaUrls.push(url);
      } else {
        setError("Error al subir uno o más archivos."); // Error si la subida falla
        return; // Salir si hay un error
      }
    }

    // Crear la publicación en Firestore
    const postRef = doc(db, 'users', user.uid, 'posts', `${Date.now()}`);
    try {
      await setDoc(postRef, {
        content: postContent,
        media: mediaUrls,
        createdAt: new Date(),
        userId: user.uid // Agregar el ID del usuario que crea la publicación
      });
    } catch (docError) {
      console.error("Error al crear la publicación:", docError);
      setError("Error al crear la publicación.");
      return; // Salir si hay un error
    }

    setPostContent(''); // Limpiar el contenido después de enviar
    setMediaFiles([]); // Limpiar archivos seleccionados
    closeModal(); // Cerrar el modal
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Crear Publicación"
      className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-auto relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{
        content: {
          maxHeight: '70vh',
          maxWidth: '70%',
          margin: '20px auto',
          padding: '20px',
          borderRadius: '8px',
          overflowY: 'auto',
          zIndex: 1001, // Z-index alto para el modal
        },
      }}
    >
      <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
        <FaTimes className="w-6 h-6" />
      </button>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-center">Crear una Publicación</h2>

        {error && <div className="text-red-600 text-center">{error}</div>} {/* Mostrar mensajes de error */}

        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="¿Qué estás pensando?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows="4"
            required
          />

          {/* Input para archivos multimedia */}
          <div className="flex items-center gap-2">
            <label className="flex items-center cursor-pointer">
              <FaImage className="text-gray-600 w-6 h-6" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <label className="flex items-center cursor-pointer">
              <FaVideo className="text-gray-600 w-6 h-6" />
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Vista previa de los archivos seleccionados */}
          <div className="flex flex-wrap gap-2">
            {mediaFiles.map((file, index) => (
              <div key={index} className="relative">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end">
            <button type="submit" className="bg-[#ff9800] text-white px-4 py-2 rounded flex items-center">
              <FaUpload className="mr-2" /> {/* Icono de subida */}
              Publicar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PostModal;
