import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const handleOnCLick = () => {
    navigate("/editProfile");
  };
  const handleOnAdd = () => {
    navigate("/create");
  };

  const user = {
    name: "Sakshi Agarwal",
    bio: "Just someone who loves designing, sketching, and finding beauty in the little things 💕",
    profilePicture: "https://via.placeholder.com/150", // Replace with user's profile picture URL
    coverImage: "https://via.placeholder.com/800x300", // Replace with cover image URL
    posts: [
      {
        id: 1,
        image: "https://via.placeholder.com/300",
        caption: "Design meet",
        likes: 67,
        mediaCount: 2,
      },
      {
        id: 2,
        image: "https://via.placeholder.com/300",
        caption: "Working on a B2B project",
        likes: 40,
        mediaCount: 1,
      },
      {
        id: 3,
        image: "https://via.placeholder.com/300",
        caption: "Parachute",
        likes: 46,
        mediaCount: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={user.coverImage}
          alt="Cover"
          className="w-full h-48 object-cover"
        />
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
          className="mt-4 px-4 py-2 text-white bg-black  rounded-lg shadow-md "
        >
          Edit Profile
        </button>
      </div>

      {/* My Posts */}
      <div className="mt-8 px-4">
        <h2 className="text-lg font-bold mb-4">My Posts</h2>
        <div className="grid grid-cols-2 gap-4">
          {user.posts.map((post) => (
            <div
              key={post.id}
              className="relative bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-40 object-cover"
              />
              <div className="p-2">
                <p className="text-sm font-bold truncate">{post.caption}</p>
                <div className="text-gray-500 text-xs mt-1 flex justify-between items-center">
                  <span>❤️ {post.likes}</span>
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
