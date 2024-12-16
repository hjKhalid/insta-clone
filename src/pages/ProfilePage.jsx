import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const handleOnCLick = () => {
    navigate("/editProfile");
  };

  const handleOnAdd = () => {
    navigate("/create");
  };

  // Fetch user profile data
  const fetchProfileData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Fetch user document from Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser({
            name: userData.name || "Unknown User",
            bio: userData.bio || "This user hasn't added a bio yet.",
            profilePicture:
              userData.photoURL || "https://via.placeholder.com/150",
            coverImage:
              userData.coverImage || "https://via.placeholder.com/800x300",
          });
        } else {
          console.error("No user document found!");
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // Fetch user posts
  const fetchUserPosts = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Query posts by the current user
        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(postsQuery);

        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchUserPosts();
  }, []);

  if (!user) {
    return <div className="text-center mt-16">Loading profile...</div>;
  }
  const handleToPrevious =()=>{
    navigate('/feed')
  }
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={user.coverImage}
          alt="Cover"
          className="w-full h-48 object-cover"
        />
         <label className="absolute top-1 left-1 p-2 cursor-pointer">
          <button className="text-black text-lg" onClick={handleToPrevious}>
            ←
          </button>
        </label>
        {/* Profile Picture */}
        <div className="absolute left-4 bottom-[-30px]">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
          />
        </div>
      </div>

      {/* Profile Details */}
      <div className="mt-12 px-4 text-center">
        <h1 className="text-xl font-bold">{user.name}</h1>
        <p className="text-gray-600 mt-2">{user.bio}</p>
        <button
          onClick={handleOnCLick}
          className="mt-4 px-4 py-2 text-white bg-black rounded-lg shadow-md"
        >
          Edit Profile
        </button>
      </div>

      {/* My Posts */}
      <div className="mt-8 px-4">
        <h2 className="text-lg font-bold mb-4">My Posts</h2>
        <div className="grid grid-cols-2 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={post.image || "https://via.placeholder.com/300"}
                alt={post.caption}
                className="w-full h-40 object-cover"
              />
              <div className="p-2">
                <p className="text-sm font-bold truncate">
                  {post.caption || "No caption"}
                </p>
                <div className="text-gray-500 text-xs mt-1 flex justify-between items-center">
                  <span>❤️ {post.likes || 0}</span>
                  {post.mediaCount > 1 && (
                    <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">
                      {post.mediaCount}/2
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={handleOnAdd}
        className="fixed bottom-8 right-8 bg-black text-white w-12 h-12 rounded-full shadow-md flex items-center justify-center text-xl hover:bg-blue-600"
      >
        +
      </button>
    </div>
  );
};

export default ProfilePage;
