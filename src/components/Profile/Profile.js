import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import ProfileImage from './ui/ProfileImage';
import TabNavigation from './ui/TabNavigation';
import EditProfileModal from './EditProfileModal/EditProfileModal';
import PostModal from '../PostModal/PostModal';
import Admin from '../Admin/Admin';
import GPACalculator from './GPACalculator';
import CardModal from './CardModal'; 
import { Image } from 'react-bootstrap';
import { FaIdCard, FaEdit, FaHeart, FaComment, FaEllipsisH } from 'react-icons/fa';
import LoadingSkeleton from './LoadingSkeleton';
import Swal from 'sweetalert2';

function Profile() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('publicaciones');
  const [userData, setUserData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false); 
  const [posts, setPosts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [editPostId, setEditPostId] = useState(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [showMenu, setShowMenu] = useState(null); // Estado para controlar el menú de acciones
  const [commentContent, setCommentContent] = useState({}); // Estado para almacenar comentarios por post
  const [userLikes, setUserLikes] = useState({}); // Para rastrear los likes de cada usuario

  useEffect(() => {
    if (user) {
      fetchUserData(user.uid);
      fetchPosts();
    }
  }, [user]);

  const fetchUserData = async (uid) => {
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      setUserData(data);
      setUserRole(data.role);
    }
  };

  const fetchPosts = async () => {
    if (!user) return;
    const postsRef = collection(db, 'users', user.uid, 'posts');
    const postsSnapshot = await getDocs(postsRef);
    const fetchedPosts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(fetchedPosts);
  };

  const handlePost = async (postContent) => {
    if (!user) return;
    const postRef = collection(db, 'users', user.uid, 'posts');
    await addDoc(postRef, {
      content: postContent,
      authorId: user.uid,
      likes: 0, // Asegúrate de que esto sea un número
      comments: [],
      media: [],
      createdAt: new Date()
    });    
    fetchPosts();
  };

  const handleEditPost = async () => {
    if (!editPostId || !editPostContent) return;
    
    const postRef = doc(db, 'users', user.uid, 'posts', editPostId);
    await updateDoc(postRef, { content: editPostContent });
    setEditPostId(null);
    setEditPostContent('');
    fetchPosts();
  };

  const handleDeletePost = async (postId) => {
    const postRef = doc(db, 'users', user.uid, 'posts', postId);
    await deleteDoc(postRef);
    fetchPosts();
  };

  const confirmDeletePost = async (postId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      handleDeletePost(postId);
      Swal.fire('Eliminado', 'Tu publicación ha sido eliminada.', 'success');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openPostModal = () => setIsPostModalOpen(true);
  const closePostModal = () => setIsPostModalOpen(false);
  const openCardModal = () => setIsCardModalOpen(true);
  const closeCardModal = () => setIsCardModalOpen(false);

  const handleEditButtonClick = (post) => {
    setEditPostId(post.id);
    setEditPostContent(post.content);
    setShowMenu(null); // Cierra el menú de acciones al editar
  };

  const toggleMenu = (postId) => {
    setShowMenu(showMenu === postId ? null : postId); // Alterna el menú de acciones
  };

  const handleCommentChange = (postId, text) => {
    setCommentContent((prev) => ({ ...prev, [postId]: text }));
  };

  const handleCommentSubmit = async (postId) => {
    const postRef = doc(db, 'users', user.uid, 'posts', postId);
    const post = await getDoc(postRef);
    const comments = post.data().comments || [];

    await updateDoc(postRef, {
      comments: [...comments, { content: commentContent[postId], authorId: user.uid }]
    });

    setCommentContent((prev) => ({ ...prev, [postId]: '' })); // Limpiar el campo de comentario
    fetchPosts();
  };

  const handleLike = async (postId) => {
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;
  
    const postRef = doc(db, 'users', user.uid, 'posts', postId);
    
    // Controla si el usuario ya ha dado like
    const userLiked = userLikes[postId]?.includes(user.uid);
    
    // Obtener el número actual de likes desde el post
    const currentLikes = parseInt(posts[postIndex].likes) || 0; // Asegúrate de que sea un número
  
    if (userLiked) {
      // Si el usuario ya ha dado like, lo quita
      await updateDoc(postRef, {
        likes: currentLikes - 1, // Decrementa el contador de likes
      });
      setUserLikes(prev => ({
        ...prev,
        [postId]: prev[postId].filter(uid => uid !== user.uid), // Elimina el uid del like
      }));
    } else {
      // Si no ha dado like, lo agrega
      await updateDoc(postRef, {
        likes: currentLikes + 1, // Incrementa el contador de likes
      });
      setUserLikes(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), user.uid], // Agrega el uid del like
      }));
    }
  
    // Actualiza el estado local
    const updatedPosts = [...posts];
    updatedPosts[postIndex].likes = userLiked ? currentLikes - 1 : currentLikes + 1; // Actualiza localmente el contador de likes
    setPosts(updatedPosts);
  };
  

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="relative">
        {userData.coverImage ? (
          <Image
            src={userData.coverImage}
            alt="Cover photo"
            className="w-full h-[429px] object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-[429px] bg-gray-200 rounded-t-lg" />
        )}
        <div className="absolute top-4 right-4">
          <button
            onClick={openCardModal}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <FaIdCard className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute left-4 top-[370px] sm:top-[390px]">
          <ProfileImage user={userData} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mt-24 space-x-0 lg:space-x-8">
        <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded-lg mt-7">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{userData.displayName || ''}</h2>
                <button onClick={openModal} className="text-gray-500 hover:text-gray-800">
                  <FaEdit className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-500">@{user.email}</p>
              <p className="text-gray-600">{userData.career || ''}</p>
              <p className="text-gray-600">{userData.id || ''}</p>
              <p className="text-gray-600">{userData.description || ''}</p>
            </>
          )}
        </div>

        <div className="w-full lg:w-2/3">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />

          {activeTab === 'publicaciones' && (
            <div>
              <div
                onClick={openPostModal}
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
              >
                <p className="text-gray-500 text-sm">¿Qué estás pensando?</p>
              </div>
              <div className="mt-4 space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="p-4 bg-white rounded-lg shadow-md relative">
                    {editPostId === post.id ? (
                      <>
                        <textarea
                          value={editPostContent}
                          onChange={(e) => setEditPostContent(e.target.value)}
                          className="w-full border border-gray-300 rounded p-2"
                        />
                        <div className="flex justify-end mt-2">
                          <button onClick={handleEditPost} className="mr-2 text-blue-500">Guardar</button>
                          <button onClick={() => setEditPostId(null)} className="text-gray-500">Cancelar</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-800">{post.content}</p>
                        {post.media?.map((mediaUrl, index) => (
                          <img key={index} src={mediaUrl} alt={`media-${index}`} className="w-full mt-2 rounded" />
                        ))}
                        <div className="flex items-center mt-2">
                          <button className="flex items-center text-gray-600 hover:text-red-600 mr-4" onClick={() => handleLike(post.id)}>
                            <FaHeart className={`mr-1 ${userLikes[post.id]?.includes(user.uid) ? 'text-red-600' : ''}`} /> {post.likes || 0}
                          </button>
                          <button className="flex items-center text-gray-600 hover:text-blue-600 mr-4">
                            <FaComment className="mr-1" /> {post.comments?.length || 0} Comentarios
                          </button>
                          <div className="relative">
                            <button onClick={() => toggleMenu(post.id)}>
                              <FaEllipsisH />
                            </button>
                            {showMenu === post.id && (
                              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg z-10">
                                <button 
                                  onClick={() => handleEditButtonClick(post)} 
                                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                >
                                  Editar
                                </button>
                                <button 
                                  onClick={() => confirmDeletePost(post.id)} 
                                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                                >
                                  Borrar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-4">
                          <input
                            type="text"
                            placeholder="Añadir un comentario..."
                            value={commentContent[post.id] || ''}
                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                          />
                          <button
                            onClick={() => handleCommentSubmit(post.id)}
                            className="mt-2 p-2 bg-blue-500 text-white rounded"
                          >
                            Comentar
                          </button>
                        </div>
                        <div className="mt-4">
                          {post.comments && post.comments.map((comment, index) => (
                            <div key={index} className="text-gray-600">
                              <strong>{comment.authorId}</strong>: {comment.content}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calculadora' && (
            <GPACalculator />
          )}

          {activeTab === 'panel' && userRole === 'admin' && (
            <Admin />
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        userData={userData}
        setUserData={setUserData}
        user={user}
      />

      <PostModal
        isOpen={isPostModalOpen}
        closeModal={closePostModal}
        handlePost={(postContent) => {
          handlePost(postContent);
          closePostModal();
        }}
      />

      <CardModal
        isOpen={isCardModalOpen}
        closeModal={closeCardModal}
        userData={userData}
      />
    </div>
  );
}

export default Profile;
