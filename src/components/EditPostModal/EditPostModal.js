import React from 'react';

const EditProfileModal = ({ isOpen, closeModal, userData, setUserData, user }) => {
  // Destructure properties with defaults
  const { coverImage = '', displayName = '', career = '', description = '' } = userData || {};

  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      {/* Modal Content */}
      <div className="modal-content">
        {/* Example of rendering user data safely */}
        <img src={coverImage || 'default-image-url.jpg'} alt="Cover" />
        <h2>{displayName || 'Nombre del Usuario'}</h2>
        <p>{career || 'Profesión'}</p>
        <p>{description || 'Descripción'}</p>
        {/* Add your modal editing logic */}
      </div>
      {/* Close button */}
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default EditProfileModal;
