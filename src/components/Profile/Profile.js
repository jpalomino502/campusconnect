import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import ProfileImage from './ProfileImage';
import TabNavigation from './TabNavigation';
import EditProfileModal from './EditProfileModal';
import { Image } from 'react-bootstrap';
import { FaCog } from 'react-icons/fa';

function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('publicaciones');
  const [userData, setUserData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [post, setPost] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      setUserData(userSnapshot.data());
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePost = (e) => {
    e.preventDefault();
    console.log('Publicación enviada:', post);
    setPost('');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Cover Image or Default Gray Background */}
      <div className="relative">
        {userData.coverImage ? (
          <Image
            src={userData.coverImage}
            alt="Cover photo"
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-[300px] bg-gray-200 rounded-t-lg" />
        )}
        <div className="absolute top-4 right-4">
          <button
            onClick={openModal}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <FaCog className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Image */}
        <div className="absolute left-4 top-[240px] sm:top-[260px]">
          <ProfileImage user={user} getInitials={getInitials} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mt-24 space-x-0 lg:space-x-8">
        {/* Left Column - User Info */}
        <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded-lg mt-7">
          <h2 className="text-2xl font-bold">{userData.displayName || 'Nombre de Usuario'}</h2>
          <p className="text-gray-500">@{user.email}</p>
          <p className="text-gray-600 mt-2 mb-4">{userData.description || 'Esta es la descripción del perfil.'}</p>
          <p className="text-gray-600 mt-2">{userData.city || 'Ciudad de origen'}</p>
          <p className="text-gray-600 mt-2">{userData.followers || '0'} seguidores</p>
          <a href={userData.instagram || '#'} className="text-blue-500">
            {userData.instagram || '@instagram'}
          </a>
        </div>

        {/* Right Column - Tab Navigation */}
        <div className="w-full lg:w-2/3">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Post Section */}
          {activeTab === 'publicaciones' && (
            <div>
              <form onSubmit={handlePost} className="flex flex-col items-center">
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg mb-4"
                  placeholder="¿Qué estás pensando?"
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                />
                <button type="submit" className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg">
                  Publicar
                </button>
              </form>
            </div>
          )}

          {/* Calculadora Section */}
          {activeTab === 'calculadora' && (
            <div className="p-4 bg-white rounded-lg shadow-md mx-auto w-full max-w-md">
              <h3 className="text-lg font-bold mb-2 text-center">Calculadora</h3>
              <p className="text-gray-600 text-center">Esta es una sección donde se puede implementar una calculadora.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Editing Profile */}
      <EditProfileModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        userData={userData}
        setUserData={setUserData}
        user={user}
      />
    </div>
  );
}

export default Profile;
