import  { useState } from "react";
import { useNavigate } from "react-router-dom";
const EditProfilePage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Sakshi Agarwal");
  const [bio, setBio] = useState(
    "Just someone who loves designing, sketching, and finding beauty in the little things 💕"
  );
  const [profilePicture, setProfilePicture] = useState(
    "https://via.placeholder.com/150" // Replace with the current profile picture URL
  );
  const [coverImage, setCoverImage] = useState(
    "https://via.placeholder.com/800x300" // Replace with the current cover image URL
  );

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfilePicture(imageURL);
    }
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setCoverImage(imageURL);
    }
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
    // Add logic to save changes to the backend
  };
  const handleToPrevios = () => {
    navigate("/viewprofile");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
    

      {/* Cover Image */}
      <div className="relative">
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-48 object-cover"
        />
        {/* Edit Cover Image */}
        <label className="absolute top-1 left-1 p-2   cursor-pointer">
         
        <button className="text-black text-lg" onClick={handleToPrevios}>
          ←
        </button>
        </label>
        {/* Edit Cover Image */}
        <label className="absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
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
        {/* Profile Picture */}
        <div className="absolute left-4 bottom-[-30px]">
          <div className="relative">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
            {/* Edit Profile Picture */}
            <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <label className="block text-sm font-bold mb-2">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
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
