import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const PostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, "posts", id));
        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() });
        } else {
          console.error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white p-4 shadow rounded overflow-hidden">
        <h2 className="text-lg font-semibold mb-2">{post.text}</h2>
        {post.media &&
          post.media.map((url, idx) => {
            const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
            return isVideo ? (
              <video
                key={idx}
                src={url}
                controls
                className="w-full mt-4 rounded"
              />
            ) : (
              <img
                key={idx}
                src={url}
                alt="Post media"
                className="w-full mt-4 rounded"
              />
            );
          })}
        <p className="text-sm text-gray-500 mt-4">
          Posted on: {new Date(post.timestamp?.toDate()).toLocaleString()}
        </p>
        <Link to="/" className="text-blue-500 underline mt-4 inline-block">
          Back to Feed
        </Link>
      </div>
    </div>
  );
};

export default PostView;
