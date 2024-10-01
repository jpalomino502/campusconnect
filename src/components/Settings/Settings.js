// components/Settings.js
import React, { useState, useEffect } from 'react';
import { auth, storage, db } from '../../config/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Settings() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [banner, setBanner] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch existing user settings
        get(ref(db, `users/${currentUser.uid}`)).then(snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setDisplayName(data.displayName);
            setDescription(data.description);
            setNotificationsEnabled(data.notificationsEnabled);
            // Fetch and set URLs if they exist
            setBanner(data.bannerUrl || null);
            setProfilePicture(data.profileUrl || null);
          }
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Sesión cerrada con éxito!'); 
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userRef = ref(db, `users/${user.uid}`);

    let bannerUrl = '';
    let profileUrl = '';

    try {
      if (banner) {
        const bannerStorageRef = storageRef(storage, `banners/${user.uid}`);
        const bannerSnapshot = await uploadBytes(bannerStorageRef, banner);
        bannerUrl = await getDownloadURL(bannerSnapshot.ref);
      }

      if (profilePicture) {
        const profileStorageRef = storageRef(storage, `profilePictures/${user.uid}`);
        const profileSnapshot = await uploadBytes(profileStorageRef, profilePicture);
        profileUrl = await getDownloadURL(profileSnapshot.ref);
      }

      await set(userRef, {
        displayName,
        description,
        bannerUrl,
        profileUrl,
        notificationsEnabled,
      });
      toast.success('Configuraciones guardadas con éxito!');
    } catch (error) {
      toast.error('Error al guardar configuraciones!');
    }
  };

  if (!user) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Configuración de la cuenta</h1>
      
      <div className="mb-6">
        <img src={banner || '/default-banner.jpg'} alt="Banner" className="w-full h-32 object-cover rounded-lg mb-4" />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBanner(e.target.files[0])}
          className="mb-4"
        />
        <button className="bg-blue-500 text-white p-2 rounded">Cambiar banner</button>
      </div>

      <div className="flex items-center mb-6">
        <img src={profilePicture || '/default-avatar.jpg'} alt="Perfil" className="h-24 w-24 rounded-full mr-4" />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files[0])}
          className="mb-4"
        />
        <button className="bg-blue-500 text-white p-2 rounded">Cambiar foto de perfil</button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-gray-700">Nombre:</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-gray-700">Descripción:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="mr-2"
            />
            Permitir notificaciones
          </label>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Guardar Cambios
        </button>
      </form>
      <button onClick={handleLogout} className="mt-4 bg-red-500 text-white p-2 rounded">
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Settings;
