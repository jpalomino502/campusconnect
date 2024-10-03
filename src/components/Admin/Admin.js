import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../config/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import imageCompression from 'browser-image-compression';
import Modal from 'react-modal';
import AvatarEditor from 'react-avatar-editor';
import { FaTimes, FaTrashAlt, FaEdit } from 'react-icons/fa'; // Iconos para eliminar y editar
import { useAuth } from '../../contexts/AuthContext';

const ImageEditor = ({ isOpen, closeModal, image, onCrop, scale, setScale }) => {
    const editorRef = useRef(null);

    const handleCrop = () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImage().toDataURL('image/webp');
            onCrop(canvas);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Editor de imágenes"
            overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
            className="bg-white rounded-lg p-4 w-[90%] h-[90%] flex flex-col items-center justify-center"
        >
            <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 z-50"
            >
                <FaTimes className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-center mb-2">Editar Imagen</h2>
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30" />
                <AvatarEditor
                    ref={editorRef}
                    image={image}
                    width={840} // Cambia este valor al ancho que desees. Aquí es proporcional a 21:9
                    height={360} // Ajusta la altura para que mantenga la proporción 21:9 (ancho / 2.33)
                    border={20}
                    scale={scale}
                    rotate={0}
                    className="relative z-10"
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            <input
                type="range"
                value={scale}
                min="1"
                max="2"
                step="0.01"
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="my-2 w-full"
            />
            <div className="flex justify-center space-x-2">
                <button
                    onClick={handleCrop}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Guardar
                </button>
                <button
                    onClick={closeModal}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Cancelar
                </button>
            </div>
        </Modal>
    );
};

const Admin = () => {
    const { user, loading } = useAuth();
    const [publications, setPublications] = useState([]);
    const [newPublication, setNewPublication] = useState({ text: '', image: '', url: '' });
    const [imagePreview, setImagePreview] = useState(null);
    const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
    const [imageScale, setImageScale] = useState(1);
    const [editedImage, setEditedImage] = useState(null);
    const [editPublicationId, setEditPublicationId] = useState(null);
    const [currentPublication, setCurrentPublication] = useState(null); // Nuevo estado para la publicación actual
    const [activeTab, setActiveTab] = useState('create'); // Nuevo estado para las pestañas

    useEffect(() => {
        fetchPublications();
    }, []);

    const fetchPublications = async () => {
        const publicationsRef = collection(db, 'publicaciones');
        const snapshot = await getDocs(publicationsRef);
        const fetchedPublications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPublications(fetchedPublications);
    };

    const uploadImage = async (file) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 800,
            useWebWorker: true,
            fileType: 'image/webp',
        };

        try {
            const compressedFile = await imageCompression(file, options);
            const storage = getStorage();
            const storageRef = ref(storage, `publications/${compressedFile.name}`);
            await uploadBytes(storageRef, compressedFile);
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.error("Error al subir la imagen:", error);
        }
    };

    const handleNewPublication = async () => {
        if (!newPublication.text && !newPublication.image && !newPublication.url) {
            Swal.fire('Error', 'Por favor, agrega un texto, imagen o URL.', 'error');
            return;
        }

        const imageUrl = editedImage ? await uploadImage(editedImage) : newPublication.image;

        if (!imageUrl) {
            Swal.fire('Error', 'La imagen no se ha cargado correctamente.', 'error');
            return;
        }

        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción creará una nueva publicación.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, crear!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await addDoc(collection(db, 'publicaciones'), {
                    text: newPublication.text,
                    image: imageUrl,
                    url: newPublication.url,
                    createdAt: new Date(),
                });
                resetPublicationState();
                fetchPublications();
                Swal.fire('¡Creado!', 'Tu publicación ha sido creada.', 'success');
            }
        });
    };

    const resetPublicationState = () => {
        setNewPublication({ text: '', image: '', url: '' });
        setEditedImage(null);
        setImagePreview(null);
        setEditPublicationId(null);
        setCurrentPublication(null); // Resetea la publicación actual
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewPublication({ ...newPublication, image: file });
            setImagePreview(URL.createObjectURL(file));
            setIsImageEditorOpen(true);
        }
    };

    const handleCrop = (canvas) => {
        fetch(canvas)
            .then(res => res.blob())
            .then(blob => {
                const randomName = `edited-image-${Math.random().toString(36).substr(2, 9)}-${Date.now()}.webp`;
                const file = new File([blob], randomName, { type: 'image/webp' });
                setEditedImage(file);
                setImagePreview(canvas);
                setIsImageEditorOpen(false);
            })
            .catch(err => console.error("Error al convertir el canvas a Blob:", err));
    };
    

    const handleEditPublication = (pub) => {
        setNewPublication({ text: pub.text, image: pub.image, url: pub.url });
        setEditPublicationId(pub.id);
        setImagePreview(pub.image);
        setCurrentPublication(pub); // Guarda la publicación actual
        setActiveTab('edit'); // Cambia a la pestaña de edición
    };

    const handleDeletePublication = async (pubId) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará permanentemente la publicación.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar!'
        });

        if (result.isConfirmed) {
            await deleteDoc(doc(db, 'publicaciones', pubId));
            fetchPublications();
            Swal.fire('Eliminado!', 'La publicación ha sido eliminada.', 'success');
        }
    };

    const handleSaveEdit = async () => {
        // Verifica si hay una imagen editada, de lo contrario, usa la imagen existente
        const imageUrl = editedImage ? await uploadImage(editedImage) : currentPublication.image;

        await updateDoc(doc(db, 'publicaciones', editPublicationId), {
            text: newPublication.text,
            image: imageUrl, // Usa la imagen editada o la existente
            url: newPublication.url,
        });

        resetPublicationState();
        fetchPublications();
        Swal.fire('¡Actualizado!', 'Tu publicación ha sido actualizada.', 'success');
    };

    const handleBack = () => {
        resetPublicationState(); // Resetear el estado de publicación
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        resetPublicationState(); // Resetear el estado al cambiar de pestaña
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <div>Acceso denegado.</div>;
    }

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 p-4 border border-gray-300 rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Publicaciones</h1>
                <ul>
                    {publications.map((pub) => (
                        <li key={pub.id} className="flex justify-between items-center p-2 border-b border-gray-200">
                            <span>{pub.text || "Sin texto"}</span>
                            <div className="flex space-x-2">
                                <button onClick={() => handleEditPublication(pub)} className="text-blue-500">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDeletePublication(pub.id)} className="text-red-500">
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="md:w-3/4 p-4 border border-gray-300 rounded-lg">
                <div className="flex mb-4">
                    <button
                        onClick={() => handleTabChange('create')}
                        className={`flex-1 text-center py-2 rounded ${activeTab === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Nueva Publicación
                    </button>
                    <button
                        onClick={() => handleTabChange('edit')}
                        className={`flex-1 text-center py-2 rounded ${activeTab === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Editar Publicación
                    </button>
                </div>
                {activeTab === 'create' ? (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Nueva Publicación</h1>
                        <textarea
                            className="w-full h-32 p-2 border border-gray-300 rounded mb-4"
                            placeholder="Escribe el texto de la publicación..."
                            value={newPublication.text}
                            onChange={(e) => setNewPublication({ ...newPublication, text: e.target.value })}
                        />
                        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
                        {imagePreview && (
                            <div className="mb-4">
                                <img src={imagePreview} alt="Preview" className="w-full h-auto" />
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder="URL"
                            value={newPublication.url}
                            onChange={(e) => setNewPublication({ ...newPublication, url: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        />
                        <button onClick={handleNewPublication} className="px-4 py-2 bg-green-600 text-white rounded">
                            Crear Publicación
                        </button>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">{editPublicationId ? 'Editar Publicación' : 'Selecciona una Publicación para Editar'}</h1>
                        {editPublicationId ? (
                            <>
                                <textarea
                                    className="w-full h-32 p-2 border border-gray-300 rounded mb-4"
                                    placeholder="Escribe el texto de la publicación..."
                                    value={newPublication.text}
                                    onChange={(e) => setNewPublication({ ...newPublication, text: e.target.value })}
                                />
                                <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
                                {imagePreview && (
                                    <div className="mb-4">
                                        <img src={imagePreview} alt="Preview" className="w-full h-auto" />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    placeholder="URL"
                                    value={newPublication.url}
                                    onChange={(e) => setNewPublication({ ...newPublication, url: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded mb-4"
                                />
                                <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-600 text-white rounded">
                                    Guardar Cambios
                                </button>
                            </>
                        ) : (
                            <div className="text-center text-gray-500">No hay ninguna publicación seleccionada para editar.</div>
                        )}
                    </div>
                )}
            </div>
            <ImageEditor
                isOpen={isImageEditorOpen}
                closeModal={() => setIsImageEditorOpen(false)}
                image={imagePreview}
                onCrop={handleCrop}
                scale={imageScale}
                setScale={setImageScale}
            />
        </div>
    );
};

export default Admin;
