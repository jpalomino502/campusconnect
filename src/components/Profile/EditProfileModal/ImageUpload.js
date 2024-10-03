// ImageUpload.js
import { storage } from '../../../config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';

export const handleImageUpload = async (file, user, imageType) => {
  const storageRef = ref(storage, `${user.uid}/${imageType}`);
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'No se pudo cargar la imagen. Inténtalo de nuevo.',
    });
  }
  return null;
};
