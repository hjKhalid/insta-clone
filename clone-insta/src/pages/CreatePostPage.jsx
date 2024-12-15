import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "../firebase";

const CreatePostPage = () => {
  const [text, setText] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [multiSelect, setMultiSelect] = useState(false);
  const navigate = useNavigate();

  const handleToback = () => navigate("/feed");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (multiSelect) {
      setMediaFiles(files);
    } else {
      setSelectedMedia(files[0]);
      setMediaFiles([files[0]]);
    }
  };

  const handleCameraClick = () => {
    if (multiSelect) return;
    alert("Open Camera (Implement camera functionality here)");
  };

  const handlePost = async () => {
    if (!selectedMedia && mediaFiles.length === 0 && !text) {
      return alert("Please add text, photos, or videos to create a post.");
    }

    try {
      const uploadedMediaUrls = [];

      for (let file of mediaFiles) {
        const storageRef = ref(storage, `posts/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedMediaUrls.push(downloadURL);
      }

      await addDoc(collection(db, "posts"), {
        text,
        media: uploadedMediaUrls,
        createdAt: new Date(),
      });

      alert("Post created successfully!");
      setText("");
      setMediaFiles([]);
      setSelectedMedia(null);
      navigate("/feed");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post. Please try again.");
    }
    navigate("/feed");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-gray-50 min-h-screen flex flex-col">
        {" "}
        {/* Top Section */}
        <div className="relative">
          {selectedMedia || mediaFiles.length > 0 ? (
            <div className="h-72 bg-black flex items-center justify-center">
              {mediaFiles.map((file, index) =>
                file.type.startsWith("video") ? (
                  <video
                    key={index}
                    controls
                    src={URL.createObjectURL(file)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Media-${index}`}
                    className="h-full w-full object-cover"
                  />
                )
              )}
            </div>
          ) : (
            <div className="h-72 bg-gray-200 flex items-center justify-center text-gray-500">
              Add text, photos, or videos to preview
            </div>
          )}
          <div className="absolute top-4 left-4">
            <button
              onClick={handleToback}
              className="text-black rounded-full p-2"
            >
              ←
            </button>
          </div>
          {/* <div className="absolute top-4 right-4">
          <button
            onClick={handlePost}
            className=" text-black rounded-full px-4 py-2  "
          >
            Next
          </button>
        </div> */}
        </div>
        {/* Text Input */}
        <div className="p-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Gallery Section */}
        <div className="p-4 flex-1">
          <h2 className="text-lg align-baseline font-bold mb-2 flex justify-between">
            <p className="mt-2"> Gallery</p>
            <div>
              {" "}
              <button
                onClick={handleCameraClick}
                className={`bg-gray-200 p-2 rounded-full shadow-md ${
                  multiSelect
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-300"
                }`}
                disabled={multiSelect}
              >
                Camera
              </button>
            </div>
            <div>
              {" "}
              <label className="flex items-center space-x-2">
                <input
                  type="file"
                  multiple={multiSelect}
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button className="bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300">
                  📷
                </button>
              </label>
            </div>
            <div>
              <label className="flex items-center mt-2 space-x-2">
                <input
                  type="checkbox"
                  checked={multiSelect}
                  onChange={(e) => setMultiSelect(e.target.checked)}
                />
                <span>Multi-select</span>
              </label>
            </div>
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {mediaFiles.map((file, index) => (
              <div
                key={index}
                className={`relative rounded-lg overflow-hidden border ${
                  file === selectedMedia
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedMedia(file)}
              >
                {file.type.startsWith("video") ? (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full h-24 object-cover"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Media"
                    className="w-full h-24 object-cover"
                  />
                )}
                {file === selectedMedia && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* File Upload */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* <label className="flex items-center space-x-2">
            <input
              type="file"
              multiple={multiSelect}
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button className="bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300">
              📷
            </button>
          </label> */}
            {/* <button
            onClick={handleCameraClick}
            className={`bg-gray-200 p-2 rounded-full shadow-md ${
              multiSelect
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-gray-300"
            }`}
            disabled={multiSelect}
          >
            Camera
          </button> */}
          </div>
          {/* <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={multiSelect}
              onChange={(e) => setMultiSelect(e.target.checked)}
            />
            <span>Multi-select</span>
          </label>
        </div> */}
          <button
            onClick={handlePost}
            className="bg-black text-white w-full py-2 px-6 rounded-2xl shadow-md "
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
