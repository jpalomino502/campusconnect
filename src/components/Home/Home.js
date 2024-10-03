import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import { FaHeart, FaComment } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import PostModal from '../PostModal/PostModal';
import Sidebar from './Sidebar';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Inicializa useNavigate
  const [posts, setPosts] = useState([]);
  const [news, setNews] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [visibleComments, setVisibleComments] = useState({});
  const [usersData, setUsersData] = useState({});
  const [userLikes, setUserLikes] = useState({}); // Para rastrear los likes de cada usuario

  useEffect(() => {
    const fetchPostsAndNews = async () => {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const usersData = {};

      usersSnapshot.forEach(userDoc => {
        usersData[userDoc.id] = userDoc.data();
      });
      
      setUsersData(usersData);

      const allPosts = [];
      for (const uid in usersData) {
        const postsRef = collection(db, 'users', uid, 'posts');
        const postsSnapshot = await getDocs(postsRef);
        postsSnapshot.forEach(postDoc => {
          const postData = { ...postDoc.data(), userId: uid, postId: postDoc.id };
          postData.user = usersData[uid];
          allPosts.push(postData);
        });
      }

      setPosts(allPosts);
      const newsRef = collection(db, 'publicaciones');
      const newsSnapshot = await getDocs(newsRef);
      const newsData = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNews(newsData);
      setLoading(false);
    };

    fetchPostsAndNews();

    const interval = setInterval(() => {
      fetchPostsAndNews();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handlePostSubmit = async () => {
    if (!newPostContent) return;

    const newPost = {
      content: newPostContent,
      media: [],
      likes: 0,
      comments: [],
    };

    const userPostsRef = collection(db, 'users', user.uid, 'posts');
    const postRef = await addDoc(userPostsRef, newPost);

    setPosts([{ ...newPost, postId: postRef.id }, ...posts]);
    setNewPostContent('');
  };

  const handleLike = async (postId) => {
    // Redirigir a login si el usuario no está autenticado
    if (!user) {
      navigate('/login'); // Cambia '/login' por la ruta de tu página de inicio de sesión
      return;
    }

    const postIndex = posts.findIndex(p => p.postId === postId);
    if (postIndex === -1) return;
  
    const postRef = doc(db, 'users', posts[postIndex].userId, 'posts', postId);
    const userLiked = userLikes[postId]?.includes(user.uid);
    
    if (userLiked) {
      await updateDoc(postRef, {
        likes: posts[postIndex].likes - 1,
      });
      setUserLikes(prev => ({
        ...prev,
        [postId]: prev[postId].filter(uid => uid !== user.uid),
      }));
    } else {
      await updateDoc(postRef, {
        likes: posts[postIndex].likes + 1,
      });
      setUserLikes(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), user.uid],
      }));
    }
  
    const updatedPosts = [...posts];
    updatedPosts[postIndex].likes = userLiked ? posts[postIndex].likes - 1 : posts[postIndex].likes + 1;
    setPosts(updatedPosts);
    
    const likeButton = document.querySelector(`.like-button[data-id="${postId}"]`);
    if (likeButton) {
      likeButton.classList.add("like-animation");
      setTimeout(() => {
        likeButton.classList.remove("like-animation");
      }, 300);
    }
  };
  
  const handleCommentSubmit = async (postId) => {
    // Redirigir a login si el usuario no está autenticado
    if (!user) {
      navigate('/login'); // Cambia '/login' por la ruta de tu página de inicio de sesión
      return;
    }

    if (!newComment) return;

    const postIndex = posts.findIndex(p => p.postId === postId);
    if (postIndex === -1) return;

    const postRef = doc(db, 'users', posts[postIndex].userId, 'posts', postId);
    
    if (!posts[postIndex].comments) {
      posts[postIndex].comments = [];
    }

    await updateDoc(postRef, {
      comments: arrayUnion({
        userId: user.uid,
        comment: newComment,
        timestamp: new Date().toISOString(),
      }),
    });

    const updatedPosts = [...posts];
    updatedPosts[postIndex].comments.push({
      userId: user.uid, 
      comment: newComment, 
      timestamp: new Date().toISOString()
    });
    setPosts(updatedPosts);
    setNewComment('');
  };

  const toggleCommentsVisibility = (postId) => {
    setVisibleComments(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  return (
    <div className="flex">
      <div className="flex-1 container mx-auto p-2 space-y-2">
        <div
          onClick={() => setModalIsOpen(true)}
          className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
        >
          <p className="text-gray-500 text-sm">¿Qué estás pensando?</p>
        </div>
        <section className="mb-10">
          {loading ? (
            <div className="bg-gray-300 h-64 rounded-lg w-full" />
          ) : (
            <Slider {...sliderSettings} className="mySwiper">
              {news.length > 0 ? news.map((item) => (
                <div key={item.id} className="p-1 flex flex-col items-center">
                  <div className="relative w-full" style={{ paddingBottom: '40%' }}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full h-full absolute inset-0">
                      <img
                        src={item.image}
                        alt="Noticia"
                        className="rounded-lg absolute inset-0 w-full h-full object-cover"
                      />
                    </a>
                  </div>
                  <p className="text-gray-700 mt-2 text-sm">{item.text || ''}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 bg-[#ff9800] text-white px-2 py-1 text-xs rounded-md hover:bg-orange-600 transition"
                  >
                    Leer más
                  </a>
                </div>
              )) : (
                <div className="text-center">No hay noticias disponibles.</div>
              )}
            </Slider>
          )}
        </section>

        <PostModal 
          isOpen={modalIsOpen} 
          closeModal={() => setModalIsOpen(false)} 
          handlePostSubmit={handlePostSubmit} 
          newPostContent={newPostContent}
          setNewPostContent={setNewPostContent}
        />

        <div className="flex mt-2 space-x-2">
        <div className="hidden lg:block w-1/4 h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden sticky top-[20px]">
  <Sidebar />
</div>


          <div className="flex-1 space-y-2">
            {loading ? (
              <Skeleton count={3} height={80} />
            ) : (
              posts.map((post) => (
                <div key={post.postId} className="p-2 bg-white rounded-lg shadow-md"> 
                  <div className="flex items-center mb-2">
                    <img src={post.user?.photoURL || ''} alt={post.user?.displayName} className="w-8 h-8 rounded-full mr-2" />
                    <div>
                      <h3 className="font-semibold text-sm">{post.user?.displayName || 'Usuario desconocido'}</h3>
                      <p className="text-gray-500 text-xs">{post.user?.career || 'Sin carrera'}</p>
                    </div>
                  </div>
                  <p className="text-gray-800 text-sm">{post.content}</p>
                  
                  <div className="flex justify-center mt-2">
                    {post.media?.map((mediaUrl, index) => (
                      <img key={index} src={mediaUrl} alt={`media-${index}`} className="max-w-full h-auto rounded" />
                    ))}
                  </div>

                  <div className="flex items-center mt-1">
                    <button 
                      onClick={() => handleLike(post.postId)} 
                      className={`like-button flex items-center mr-2 text-sm ${userLikes[post.postId]?.includes(user.uid) ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`} 
                      data-id={post.postId}
                    >
                      <FaHeart className="mr-1" /> 
                      <span className={`like-count ${post.likes > 0 ? "opacity-100" : "opacity-0"}`}>
                        {post.likes || 0}
                      </span>
                    </button>
                    <button onClick={() => toggleCommentsVisibility(post.postId)} className="flex items-center text-gray-600 hover:text-blue-600 text-sm">
                      <FaComment className="mr-1" /> {post.comments?.length || 0} Comentarios
                    </button>
                  </div>

                  {visibleComments[post.postId] && (
                    <div className="mt-2">
                      <div>
                        {post.comments?.map((comment, index) => (
                          <div key={index} className="border-t py-1 flex items-start">
                            <img src={usersData[comment.userId]?.photoURL || ''} alt="Comentario" className="w-6 h-6 rounded-full mr-2" />
                            <div>
                              <span className="font-semibold">{usersData[comment.userId]?.displayName || 'Usuario'}</span>: {comment.comment}
                            </div>
                          </div>
                        ))}
                      </div>

                      <input 
                        type="text" 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                        placeholder="Escribe un comentario..."
                        className="border rounded p-1 w-full mt-2"
                      />
                      <button 
                        onClick={() => handleCommentSubmit(post.postId)} 
                        className="bg-[#ff9800]text-white rounded px-2 py-1 mt-1"
                      >
                        Comentar
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="hidden lg:block w-1/4 h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden sticky top-[20px]">
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
