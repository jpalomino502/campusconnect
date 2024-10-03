import React from 'react';

const EditProfileModal = ({ isOpen, closeModal, userData, setUserData, user }) => {
  const { coverImage = '', displayName = '', career = '', description = '' } = userData || {};

  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-content">
        <img src={coverImage || 'default-image-url.jpg'} alt="Cover" />
        <h2>{displayName || 'Nombre del Usuario'}</h2>
        <p>{career || 'Profesión'}</p>
        <p>{description || 'Descripción'}</p>
      </div>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default EditProfileModal;
