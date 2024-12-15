import React, { useState } from "react";
import {
  FaTwitter,
  FaFacebook,
  FaReddit,
  FaDiscord,
  FaWhatsapp,
  FaTelegram,
  FaInstagram,
  FaFacebookMessenger,
  FaCopy,
} from "react-icons/fa";

const ShareModal = ({ contentLink, onClose }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(contentLink).then(
      () => {
        alert("Link copied to clipboard!");
      },
      (error) => {
        alert("Failed to copy the link.");
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>
        {/* Header */}
        <h2 className="text-xl font-bold mb-4 text-center">Share post</h2>

        {/* Social Media Icons */}
        <div className="grid grid-cols-4 gap-4 text-center mb-6">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              contentLink
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:scale-110"
          >
            <FaTwitter size={24} />
            <p className="text-xs mt-1">Twitter</p>
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              contentLink
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:scale-110"
          >
            <FaFacebook size={24} />
            <p className="text-xs mt-1">Facebook</p>
          </a>
          <a
            href={`https://reddit.com/submit?url=${encodeURIComponent(
              contentLink
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:scale-110"
          >
            <FaReddit size={24} />
            <p className="text-xs mt-1">Reddit</p>
          </a>
          <a
            href={`https://discord.com/channels/@me`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:scale-110"
          >
            <FaDiscord size={24} />
            <p className="text-xs mt-1">Discord</p>
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(contentLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:scale-110"
          >
            <FaWhatsapp size={24} />
            <p className="text-xs mt-1">WhatsApp</p>
          </a>
          <a
            href={`https://m.me?link=${encodeURIComponent(contentLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:scale-110"
          >
            <FaFacebookMessenger size={24} />
            <p className="text-xs mt-1">Messenger</p>
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              contentLink
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:scale-110"
          >
            <FaTelegram size={24} />
            <p className="text-xs mt-1">Telegram</p>
          </a>
          <a
            href={`https://www.instagram.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:scale-110"
          >
            <FaInstagram size={24} />
            <p className="text-xs mt-1">Instagram</p>
          </a>
        </div>

        {/* Copy Link Section */}
        <div className="bg-gray-100 p-2 rounded-lg flex justify-between items-center">
          <input
            type="text"
            value={contentLink}
            readOnly
            className="bg-gray-100 w-full text-sm focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="text-gray-700 hover:text-gray-900 ml-2"
          >
            <FaCopy />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ShareModal;
