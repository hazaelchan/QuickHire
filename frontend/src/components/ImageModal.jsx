import React from 'react';
import ReactDOM from 'react-dom';

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); // Close the modal when clicking outside the image
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal( 
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={handleClose}>
      <div className="bg-white p-4 rounded relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-red-600 font-bold">Close</button>
        <img src={imageUrl} alt="Enlarged" className="max-w-[70%] max-h-[70%] mx-auto" />
      </div>
    </div>,
    document.body
  );
};

export default ImageModal;
