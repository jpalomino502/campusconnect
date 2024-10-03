import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import { FaHeart, FaComment } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import PostModal from '../PostModal/PostModal';
import Sidebar from './Sidebar';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [news, setNews] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchPostsAndNews = async () => {
      setLoading(true);

      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const usersData = {};

      usersSnapshot.forEach(userDoc => {
        usersData[userDoc.id] = userDoc.data();
      });

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
    const interval = setInterval(fetchPostsAndNews, 30000);

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
    const postRef = doc(db, 'users', user.uid, 'posts', postId);
    const post = posts.find(p => p.postId === postId);

    await updateDoc(postRef, {
      likes: post.likes + 1,
    });

    setPosts(prevPosts => 
      prevPosts.map(p => 
        p.postId === postId ? { ...p, likes: p.likes + 1 } : p
      )
    );
  };

  const formatDate = (timestamp) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', options);
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
        <section className="mb-10">
          {loading ? (
            <Skeleton height={150} count={1} />
          ) : (
            <Slider {...sliderSettings} className="mySwiper">
              {news.length > 0 ? news.map((item) => (
                <div key={item.id} className="p-1 flex flex-col items-center">
                  <div className="relative w-full">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="w-full">
                    <img
                      src={item.image}
                      alt="Noticia"
                      className="rounded-lg w-[70%] h-[calc(70vw*3/7)] object-cover mx-auto"
                    />
                    </a>
                    <p className="text-gray-700 mt-1 text-sm">{item.text || ''}</p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 bg-[#ff9800] text-white px-2 py-1 text-xs rounded-md hover:bg-orange-600 transition"
                    >
                      Leer más
                    </a>
                  </div>
                </div>
              )) : (
                <div className="text-center">No hay noticias disponibles.</div>
              )}
            </Slider>
          )}
        </section>

        <div
          onClick={() => setModalIsOpen(true)}
          className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
        >
          <p className="text-gray-500 text-sm">¿Qué estás pensando?</p>
        </div>

        <PostModal 
          isOpen={modalIsOpen} 
          closeModal={() => setModalIsOpen(false)} 
          handlePostSubmit={handlePostSubmit} 
          newPostContent={newPostContent}
          setNewPostContent={setNewPostContent}
        />

        <div className="flex mt-2 space-x-2">
          <div className="hidden lg:block w-1/4 h-[calc(100vh-64px)] overflow-y-auto sticky top-16">
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
                  {post.media?.map((mediaUrl, index) => (
                    <img key={index} src={mediaUrl} alt={`media-${index}`} className="w-full mt-2 rounded" />
                  ))}
                  <div className="flex items-center mt-1">
                    <button onClick={() => handleLike(post.postId)} className="flex items-center text-gray-600 hover:text-red-600 mr-2 text-sm">
                      <FaHeart className="mr-1" /> {post.likes || 0}
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-blue-600 text-sm">
                      <FaComment className="mr-1" /> {post.comments?.length || 0} Comentarios
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
