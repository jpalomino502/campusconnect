import React, { useState } from 'react';
import Modal from 'react-modal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { useDropzone } from 'react-dropzone';
import Crop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Image } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi'; // Icono de lápiz de react-icons

const EditProfileModal = ({ isOpen, closeModal, userData, setUserData, user }) => {
  const [bannerImage, setBannerImage] = useState(userData.bannerImage || '');
  const [profileImage, setProfileImage] = useState(userData.profileImage || '');
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [socialLinks, setSocialLinks] = useState(userData.socialLinks || []);
  const [isCroppingProfile, setIsCroppingProfile] = useState(false);
  const [isCroppingBanner, setIsCroppingBanner] = useState(false);

  const onDropProfile = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setIsCroppingProfile(true);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onDropBanner = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageToCrop(reader.result);
      setIsCroppingBanner(true);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (crop) => {
    if (!imageToCrop) return;

    const canvas = document.createElement('canvas');
    const image = document.createElement('img');
    image.src = imageToCrop;

    image.onload = () => {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      setProfileImage(canvas.toDataURL('image/webp', 0.8));
      setIsCroppingProfile(false);
      setImageToCrop(null);
    };
  };

  const handleBannerCropComplete = async (crop) => {
    if (!bannerImage) return;

    const canvas = document.createElement('canvas');
    const image = document.createElement('img');
    image.src = bannerImage;

    image.onload = () => {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      setBannerImage(canvas.toDataURL('image/webp', 0.8));
      setIsCroppingBanner(false);
      setImageToCrop(null);
    };
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      ...userData,
      bannerImage,
      profileImage,
      socialLinks,
    });
    closeModal();
  };

  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSocialLinkChange = (index, value) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = value;
    setSocialLinks(updatedLinks);
  };

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, '']);
  };

  const handleRemoveSocialLink = (index) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
  };

  const { getRootProps: getProfileProps, getInputProps: getProfileInputProps } = useDropzone({ onDrop: onDropProfile });
  const { getRootProps: getBannerProps, getInputProps: getBannerInputProps } = useDropzone({ onDrop: onDropBanner });

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Editar Perfil"
      className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{
        content: {
          padding: '20px',
          borderRadius: '10px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto',
        },
      }}
    >
      <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        
        {/* Banner de Perfil */}
        <div>
          <div className="flex justify-between items-center">
            <label className="block text-gray-700">Banner de Perfil</label>
            <button type="button" onClick={() => getBannerProps()} className="text-blue-500">
              <FiEdit />
            </button>
          </div>
          <div {...getBannerProps({ className: 'dropzone border border-gray-300 rounded-lg mb-4 relative' })}>
            <input {...getBannerInputProps()} />
            {bannerImage ? (
              <Image src={bannerImage} alt="Banner Preview" className="w-full h-[150px] object-cover rounded-lg" />
            ) : (
              <div className="w-full h-[150px] bg-gray-300 rounded-lg flex items-center justify-center">
                <p>No hay imagen de banner</p>
              </div>
            )}
          </div>
        </div>

        {/* Foto de Perfil */}
        <div>
          <div className="flex justify-between items-center">
            <label className="block text-gray-700">Foto de Perfil</label>
            <button type="button" onClick={() => getProfileProps()} className="text-blue-500">
              <FiEdit />
            </button>
          </div>
          <div {...getProfileProps({ className: 'dropzone border border-gray-300 rounded-lg mb-4 relative' })}>
            <input {...getProfileInputProps()} />
            {profileImage || userData.profileImage ? (
              <Image src={profileImage || userData.profileImage} alt="Profile Preview" className="w-20 h-20 object-cover rounded-full" />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <p>No hay imagen de perfil</p>
              </div>
            )}
          </div>

          {/* Editor de Recortes para la Foto de Perfil */}
          {isCroppingProfile && imageToCrop && (
            <Crop
              src={imageToCrop}
              crop={crop}
              onCropChange={setCrop}
              onImageLoaded={() => handleCropComplete(crop)}
              onComplete={() => handleCropComplete(crop)}
              style={{ maxWidth: '100%' }}
            />
          )}
          
          {/* Editor de Recortes para el Banner */}
          {isCroppingBanner && bannerImage && (
            <Crop
              src={bannerImage}
              crop={crop}
              onCropChange={setCrop}
              onImageLoaded={() => handleBannerCropComplete(crop)}
              onComplete={() => handleBannerCropComplete(crop)}
              style={{ maxWidth: '100%' }}
            />
          )}
        </div>

        {/* Información de usuario */}
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            value={userData.name || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Redes sociales */}
        <div>
          <label className="block text-gray-700">Redes Sociales</label>
          {socialLinks.map((link, index) => (
            <div className="flex items-center space-x-2 mb-2" key={index}>
              <input
                type="text"
                value={link}
                onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="URL de la red social"
              />
              <button
                type="button"
                onClick={() => handleRemoveSocialLink(index)}
                className="text-red-500"
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="text-blue-500"
          >
            Agregar otra red social
          </button>
        </div>

        <div>
          <label className="block text-gray-700">Teléfono</label>
          <input
            type="text"
            name="phone"
            value={userData.phone || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex justify-end mt-4">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Guardar Cambios</button>
        </div>
      </form>
      <button onClick={closeModal} className="mt-4 text-gray-500 underline">Cancelar</button>
    </Modal>
  );
};

export default EditProfileModal;
