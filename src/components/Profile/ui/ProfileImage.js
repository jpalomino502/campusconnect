import React from 'react';
import { Image } from 'react-bootstrap'; // Ensure this import is correct

const ProfileImage = ({ user }) => {
  return (
    <div className="absolute bottom-0 left-4 transform translate-y-1/2 w-40 h-40 border-4 border-white rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
      {user.photoURL ? (
        <Image 
          src={user.photoURL} 
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-centerbg-gray-300">
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
