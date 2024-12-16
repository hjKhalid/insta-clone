import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  doc,
  getDoc,
} from "firebase/firestore";
import share from "../assets/navigation-2.png";
import heart from "../assets/HiHeart.png";
import ShareModal from "../component/ShareModal";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [userName, setUserName] = useState("");
  const [userProfilePhoto, setUserProfilePhoto] = useState("");
  const [openShare, setOpenModal] = useState(false);
  const [showBreadcrumb, setShowBreadcrumb] = useState(false); // For breadcrumb visibility

  const navigate = useNavigate();
  const staticPosts = [
    {
      id: 1,
      username: "Aarav",
      time: "3 hours ago",
      text: "Just arrived in New York City! Excited to explore the sights, sounds, and energy of this amazing place. 🗽✨ #NYC #Travel",
      media: [
        "https://source.unsplash.com/200x200/?newyork",
        "https://source.unsplash.com/200x200/?cityscape",
      ],
      likes: 67,
    },
    {
      id: 2,
      username: "Sneha",
      time: "1 day ago",
      text: "Taking a moment to slow down, breathe, and focus on myself. 🌸✨ Self-care isn’t selfish — it’s necessary. 💕 #SelfCare #MeTime #Wellness",
      media: ["https://source.unsplash.com/200x200/?selfcare"],
      likes: 45,
    },
    {
      id: 3,
      username: "Aarav",
      time: "3 hours ago",
      text: "Just arrived in New York City! Excited to explore the sights, sounds, and energy of this amazing place. 🗽✨ #NYC #Travel",
      media: [
        "https://source.unsplash.com/200x200/?newyork",
        "https://source.unsplash.com/200x200/?cityscape",
      ],
      likes: 67,
    },
  ];

  // Fetch current user info
  const fetchUserInfo = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserName(userData.name || "Unknown User");
          setUserProfilePhoto(
            userData.photoURL || "https://via.placeholder.com/40"
          );
        } else {
          console.error("No user document found!");
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Fetch friend list of the current user
  const fetchFriends = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          return userData.friends || []; // Returns an array of friend user IDs
        }
      }
      return [];
    } catch (error) {
      console.error("Error fetching friends:", error);
      return [];
    }
  };

  // Fetch posts from Firestore
  const fetchPosts = async (initial = false) => {
    try {
      const friends = await fetchFriends();

      if (friends.length === 0) {
        setPosts([]); // No friends, no posts
        setHasMore(false);
        return;
      }

      const postQuery = query(
        collection(db, "posts"),
        orderBy("timestamp", "desc"),
        limit(20),
        ...(lastDoc && !initial ? [startAfter(lastDoc)] : [])
      );

      const snapshot = await getDocs(postQuery);

      const newPosts = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((post) => friends.includes(post.userId)); // Filter posts by friends' user IDs

      setPosts((prev) => (initial ? newPosts : [...prev, ...newPosts]));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(newPosts.length > 0);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleOnClickShare = () => {
    setOpenModal(!openShare);
  };

  const navigateToCreatePost = () => {
    navigate("/create");
  };
  useEffect(() => {
    const handleScroll = () => {
      setShowBreadcrumb(window.scrollY > 100); // Show breadcrumb after scrolling 100px
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const initializeFeed = async () => {
      await fetchUserInfo();
      await fetchPosts(true);
    };

    initializeFeed();
  }, []);

  const navigateToProfile = () => {
    navigate("/viewprofile");
  };
  console.log(posts);

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header Section */}
      <div className="flex items-center bg-white p-4 mb-6">
        <img
          onClick={navigateToProfile}
          src={userProfilePhoto}
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
        <div className="ml-4">
          <h2 className="text-sm text-gray-500">Welcome Back,</h2>
          <h1 className="text-lg font-bold text-gray-700">{userName}</h1>
        </div>
      </div>

      {/* Breadcrumb Button */}
      {showBreadcrumb && (
        <button
          onClick={navigateToProfile}
          className="fixed top-4 left-4 bg-black text-white px-4 py-2 rounded-full shadow-lg"
        >
          Profile
        </button>
      )}
      {/* Feeds Section */}
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-gray-800">Feeds</h1>
        {posts.length === 0 ? (
          <>
            {posts?.map((post) => (
              <div
                key={post.id}
                className={`shadow rounded-3xl p-4 ${
                  post.id % 2 === 0 ? "bg-[#F7EBFF]" : "bg-[#FFFAEE]"
                }`}
              >
                <div className="flex items-center mb-2">
                  <img
                    src={
                      post.userProfilePhoto || "https://via.placeholder.com/40"
                    }
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-4">
                    <h2 className="text-sm font-bold">
                      {post.username || "Unknown User"}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {new Date(
                        post.timestamp?.seconds * 1000
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{post.text}</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {post.media?.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt="Post"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <button className="flex items-center text-gray-500 hover:text-red-500">
                    <img src={heart} alt="Like" />{" "}
                    <span className="ml-1">{post.likes || 0}</span>
                  </button>
                  <button
                    onClick={handleOnClickShare}
                    className="flex items-center rounded-3xl shadow-sm border px-3 py-1 gap-1 text-gray-500 hover:text-blue-500"
                  >
                    <img src={share} alt="share" /> Share
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {staticPosts.map((post) => {
              <div
                key={post.id}
                className={`shadow rounded-3xl p-4 ${
                  post.id % 2 === 0 ? "bg-[#F7EBFF]" : "bg-[#FFFAEE]"
                }`}
              >
                <div className="flex items-center mb-2">
                  <img
                    src={post.media || "https://via.placeholder.com/40"}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="ml-4">
                    <h2 className="text-sm font-bold">
                      {post.username || "Unknown User"}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {new Date(post.time?.seconds * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{post.text}</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {post.media?.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt="Post"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <button className="flex items-center text-gray-500 hover:text-red-500">
                    <img src={heart} alt="Like" />{" "}
                    <span className="ml-1">{post.likes || 0}</span>
                  </button>
                  <button
                    onClick={handleOnClickShare}
                    className="flex items-center rounded-3xl shadow-sm border px-3 py-1 gap-1 text-gray-500 hover:text-blue-500"
                  >
                    <img src={share} alt="share" /> Share
                  </button>
                </div>
              </div>;
            })}
          </>
        )}
      </div>
      {openShare ? <ShareModal onClose={() => setOpenModal(false)} /> : null}

      {/* Floating Action Button */}
      <button
        onClick={navigateToCreatePost}
        className="fixed bottom-6 right-6 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
      >
        +
      </button>
    </div>
  );
};

export default Feed;
