// components/Profile.js
import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { FaCog } from 'react-icons/fa';
// Cambia firebase/database por firebase/firestore
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import ProfileImage from './ProfileImage';
import TabNavigation from './TabNavigation';

function Profile() {
  const [user, setUser] = useState(null);
  const [post, setPost] = useState('');
  const [activeTab, setActiveTab] = useState('publicaciones');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);  // Cambiado para usar Firestore
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Cambia la lógica de fetchUserData para usar Firestore
  const fetchUserData = async (uid) => {
    const userRef = doc(db, 'users', uid);  // Ref Firestore
    const userSnapshot = await getDoc(userRef);  // Obtener datos de Firestore
    if (userSnapshot.exists()) {
      console.log(userSnapshot.data());  // Ver los datos del usuario
    }
  };

  const handlePost = (e) => {
    e.preventDefault();
    console.log('Publicación enviada:', post);
    setPost('');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  if (!user) {
    return;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="relative">
        <Image 
          src="https://via.placeholder.com/1000x300.png?text= "
          alt="Cover photo"
          className="w-full h-[300px] object-cover rounded-t-lg"
        />
        <div className="absolute top-4 right-4">
          <button 
            onClick={handleSettings}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <FaCog className="w-6 h-6" />
          </button>
        </div>
        <ProfileImage user={user} getInitials={getInitials} />
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-4xl font-bold">{user.displayName || user.email}</h2>
        <p className="text-gray-500">@{user.email}</p>
        {/* Descripción debajo del nombre */}
        <p className="text-gray-600 mt-2">
          Esta es la descripción del perfil de {user.displayName || user.email}.
        </p>
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

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

      {activeTab === 'calculadora' && (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-2">Calculadora</h3>
          <p className="text-gray-600">Esta es una sección donde se puede implementar una calculadora.</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
