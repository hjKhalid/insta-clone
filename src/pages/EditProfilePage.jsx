import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, Firestore, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [coverImage, setCoverImage] = useState("");

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchProfileData(currentUser.uid);
      } else {
        navigate("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setUser({ profilePicture: imageURL });
    }
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setUser({ coverImage: imageURL });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const userRef = doc(Firestore, "users", user.uid);
      await setDoc(
        userRef,
        {
          user,
          bio,
          profilePicture,
          coverImage,
        },
        { merge: true } // Merge to update only specific fields
      );
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  const handleToPrevious = () => {
    navigate("/viewprofile");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={
            user.coverImage
              ? user.coverImage
              : "https://via.placeholder.com/800x300"
          }
          alt="Cover"
          className="w-full h-48 object-cover"
        />
        <label className="absolute top-1 left-1 p-2 cursor-pointer">
          <button className="text-black text-lg" onClick={handleToPrevious}>
            ←
          </button>
        </label>
        <label className="absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleCoverImageChange(e)}
            className="hidden"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.414 2.586a2 2 0 010 2.828L9.828 13H7v-2.828l7.586-7.586a2 2 0 012.828 0z" />
            <path
              fillRule="evenodd"
              d="M16 5.414L14.586 4 4 14.586V16h1.414L16 5.414z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <div className="absolute left-4 bottom-[-30px]">
          <div className="relative">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
            <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleProfilePictureChange(e)}
                className="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.414 2.586a2 2 0 010 2.828L9.828 13H7v-2.828l7.586-7.586a2 2 0 012.828 0z" />
                <path
                  fillRule="evenodd"
                  d="M16 5.414L14.586 4 4 14.586V16h1.414L16 5.414z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="mt-12 px-4">
        <label className="block text-sm font-bold mb-2">Name</label>
        <input
          type="text"
          value={user.name}
          onChange={(e) => setName({ name: e.target.value })}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <label className="block text-sm font-bold mb-2">Bio</label>
        <textarea
          value={user.bio}
          onChange={(e) => setUser({ bio: e.target.value })}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          rows={4}
        ></textarea>

        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProfilePage;
