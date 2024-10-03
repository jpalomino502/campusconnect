import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import ProfileImage from './ui/ProfileImage';
import TabNavigation from './ui/TabNavigation';
import EditProfileModal from './EditProfileModal/EditProfileModal';
import PostModal from '../PostModal/PostModal';
import Admin from '../Admin/Admin';
import GPACalculator from './GPACalculator'; // Import the new component
import { Image } from 'react-bootstrap';
import { FaCog, FaEdit, FaHeart, FaComment } from 'react-icons/fa';

// Import the LoadingSkeleton component
import LoadingSkeleton from './LoadingSkeleton'; // Adjust the path as necessary

function Profile() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('publicaciones');
  const [userData, setUserData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userRole, setUserRole] = useState(null);

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
      likes: 0,
      comments: [],
      media: [],
      createdAt: new Date()
    });
    fetchPosts();
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openPostModal = () => setIsPostModalOpen(true);
  const closePostModal = () => setIsPostModalOpen(false);

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
            onClick={openModal}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <FaCog className="w-6 h-6" />
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
              <input
                type="text"
                placeholder="¿Qué estás pensando?"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 cursor-pointer"
                onClick={openPostModal}
              />
              <div className="mt-4 space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="p-4 bg-white rounded-lg shadow-md">
                    <p className="text-gray-800">{post.content}</p>
                    {post.media?.map((mediaUrl, index) => (
                      <img key={index} src={mediaUrl} alt={`media-${index}`} className="w-full mt-2 rounded" />
                    ))}
                    <div className="flex items-center mt-2">
                      <button className="flex items-center text-gray-600 hover:text-red-600 mr-4">
                        <FaHeart className="mr-1" /> {post.likes || 0}
                      </button>
                      <button className="flex items-center text-gray-600 hover:text-blue-600">
                        <FaComment className="mr-1" /> {post.comments?.length || 0} Comentarios
                      </button>
                    </div>
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
    </div>
  );
}

export default Profile;
