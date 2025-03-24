require('dotenv').config(); // Load environment variables
const cloudinary = require('cloudinary').v2;

const fs = require('fs');

// Configure Cloudinary with credentials from the environment
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Path to the sample image
const imagePath = 'C:/linkedin-clone-master/frontend/dist/img/images.jpeg'; // Path to the sample image



// Upload function
const uploadImage = async () => {
  try {
    const result = await cloudinary.uploader.upload(imagePath);
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

// Execute the upload
uploadImage();
