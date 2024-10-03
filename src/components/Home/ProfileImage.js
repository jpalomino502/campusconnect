import React from 'react';

const ProfileImage = ({ user, className }) => {
  return (
    <img
      src={user.photoURL || ''}
      alt="Profile"
      className={className}
    />
  );
};

export default ProfileImage;
