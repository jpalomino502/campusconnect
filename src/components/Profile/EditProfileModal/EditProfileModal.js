import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { handleImageUpload } from './ImageUpload';
import { dataURLToFile } from './utils';
import ImageEditor from './ImageEditor';

Modal.setAppElement('#root');

function EditProfileModal({ isOpen, closeModal, userData, setUserData, user }) {
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [isCoverEditorOpen, setIsCoverEditorOpen] = useState(false);
  const [editorImage, setEditorImage] = useState(null);
  const [scale, setScale] = useState(1);
  const profileEditorRef = useRef(null);
  const coverEditorRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setDisplayName(userData.displayName || '');
      setDescription(userData.description || '');
      setProfileImage(null);
      setCoverImage(null);
    }
  }, [isOpen, userData]);

  const handleConfirmSave = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro de que deseas guardar los cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff9800',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar cambios',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    let updatedData = { displayName, description };

    if (profileImage) {
      const profileImageUrl = await handleImageUpload(profileImage, user, 'profileImage');
      if (profileImageUrl) {
        updatedData.photoURL = profileImageUrl;
      }
    }

    if (coverImage) {
      const coverImageUrl = await handleImageUpload(coverImage, user, 'coverImage');
      if (coverImageUrl) {
        updatedData.coverImage = coverImageUrl;
      }
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, updatedData);

      setUserData((prevState) => ({
        ...prevState,
        ...updatedData,
      }));

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Cambios guardados correctamente.',
        confirmButtonText: 'Aceptar',
      });

      closeModal();
    } catch (error) {
      console.error("Error updating user data:", error);
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'No se pudieron guardar los cambios. Inténtalo de nuevo.',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Has cerrado sesión correctamente.',
      });
    } catch (error) {
      console.error("Error cerrando sesión:", error);
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'No se pudo cerrar sesión. Inténtalo de nuevo.',
      });
    }
  };

  const openProfileEditor = (file) => {
    setEditorImage(file);
    setIsProfileEditorOpen(true);
  };

  const openCoverEditor = (file) => {
    setEditorImage(file);
    setIsCoverEditorOpen(true);
  };

  const handleCropProfile = (canvas) => {
    if (profileEditorRef.current) {
      setProfileImage(dataURLToFile(canvas, 'profile.webp'));
    }
    setIsProfileEditorOpen(false);
  };

  const handleCropCover = (canvas) => {
    if (coverEditorRef.current) {
      setCoverImage(dataURLToFile(canvas, 'cover.webp'));
    }
    setIsCoverEditorOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Editar Perfil"
        className="bg-white p-6 rounded-lg shadow-lg relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
        style={{
          content: {
            maxHeight: '70vh',
            width: '90vw',
            maxWidth: '600px', // Ancho máximo en dispositivos grandes
            margin: '40px auto',
            padding: '20px',
            borderRadius: '8px',
            overflowY: 'auto',
          },
        }}
      >
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-50">
          <FaTimes className="w-6 h-6" />
        </button>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-center">Editar Perfil</h2>
          <form onSubmit={handleConfirmSave} className="space-y-6">
            {/* Imagen de portada */}
            <div className="space-y-2">
              <label className="block font-semibold">Imagen de portada</label>
              <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden relative">
                {coverImage ? (
                  <img src={URL.createObjectURL(coverImage)} alt="Portada seleccionada" className="w-full h-full object-cover" />
                ) : userData.coverImage ? (
                  <img src={userData.coverImage} alt="Imagen de portada" className="w-full h-full object-cover" />
                ) : (
                  <p className="text-center text-gray-500 mt-16">Selecciona una imagen de portada</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => openCoverEditor(e.target.files[0])}
                />
              </div>
            </div>

            {/* Imagen de perfil */}
            <div className="space-y-2">
              <label className="block font-semibold">Imagen de perfil</label>
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden relative mx-auto">
                {profileImage ? (
                  <img src={URL.createObjectURL(profileImage)} alt="Perfil seleccionado" className="w-full h-full object-cover" />
                ) : userData.photoURL ? (
                  <img src={userData.photoURL} alt="Imagen de perfil" className="w-full h-full object-cover" />
                ) : (
                  <p className="text-center text-gray-500 mt-6">Selecciona una imagen de perfil</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => openProfileEditor(e.target.files[0])}
                />
              </div>
            </div>

            {/* Campos de texto */}
            <div className="space-y-2">
              <label className="block font-semibold">Nombre de usuario</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block font-semibold">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
                required
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cerrar sesión
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#ff9800] text-white rounded hover:bg-[#ff9000]"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Image Editors */}
      <ImageEditor 
        isOpen={isProfileEditorOpen} 
        closeModal={() => setIsProfileEditorOpen(false)} 
        image={editorImage} 
        onCrop={handleCropProfile}
        ref={profileEditorRef}
        scale={scale}
        setScale={setScale}
      />
      <ImageEditor 
        isOpen={isCoverEditorOpen} 
        closeModal={() => setIsCoverEditorOpen(false)} 
        image={editorImage} 
        onCrop={handleCropCover}
        ref={coverEditorRef}
        scale={scale}
        setScale={setScale}
      />
    </>
  );
}

export default EditProfileModal;
