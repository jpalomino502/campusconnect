// components/ProfileImage.js
import React from 'react';
import { Image } from 'react-bootstrap';

const ProfileImage = ({ user, getInitials }) => {
  return (
    <div className="absolute bottom-0 left-4 transform translate-y-1/2 w-40 h-40 border-4 border-white rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
      <span className="text-4xl font-bold text-white">
        {user.photoURL ? (
          <Image 
            src={user.photoURL} 
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          getInitials(user.displayName || user.email)
        )}
      </span>
    </div>
  );
};

export default ProfileImage;
