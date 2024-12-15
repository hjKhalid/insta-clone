import React, { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import image1 from "../../src/assets/image1.png";
import image2 from "../../src/assets/image2.png";
import image3 from "../../src/assets/image3.png";
import image4 from "../../src/assets/image4.png";
import image5 from "../../src/assets/image5.png";
import image6 from "../../src/assets/image6.png";
import brand from "../../src/assets/brand.png";
import google from "../assets/google.png";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Handle Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // User exists in Firestore, save data to localStorage
        const userData = userSnap.data();
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // User doesn't exist, save minimal data to Firestore and localStorage
        const newUserData = {
          uid: user.uid,
          name: user.displayName || "Anonymous",
          email: user.email,
          photoURL: user.photoURL || "",
          createdAt: new Date(),
        };

        await setDoc(userRef, newUserData); // Save to Firestore
        localStorage.setItem("user", JSON.stringify(newUserData)); // Save to localStorage
      }

      navigate("/feed"); // Navigate to the feed page after login
    } catch (error) {
      console.error("Google Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      ) : (
        <>
          {/* Image Grid */}
          <div className="grid grid-cols-3 gap-1 w-full max-w-md h-40 overflow-hidden mb-6">
            {[image1, image2, image3, image4, image5, image6].map(
              (src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Grid Item ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )
            )}
          </div>

          {/* Branding Section */}
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold flex justify-center items-center">
                <img src={brand} alt="Brand" className="h-10 mr-2" />
                Vibesnap
              </h1>
              <p className="text-gray-500 mt-2">
                Moments That Matter, Shared Forever.
              </p>
            </div>

            {/* Google Login Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center w-full bg-black text-white font-bold px-6 py-3 rounded-full hover:bg-gray-800 transition"
              >
                <img src={google} alt="Google Logo" className="w-6 h-6 mr-3" />
                Continue with Google
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
