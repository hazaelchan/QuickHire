import mongoose from "mongoose";

// Connection status tracking
let isConnected = false;
let retryCount = 0;
const maxRetries = 3;
const retryDelay = 5000; // 5 seconds

export const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
    });
    
    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Connection event listeners
    conn.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    conn.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err.message}`);
    });

    conn.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from DB');
      isConnected = false;
    });
    
  } catch (error) {
    retryCount++;
    console.error(`❌ MongoDB connection error (Attempt ${retryCount}/${maxRetries}): ${error.message}`);
    
    if (retryCount < maxRetries) {
      console.log(`Retrying connection in ${retryDelay/1000} seconds...`);
      setTimeout(connectDB, retryDelay);
    } else {
      console.error('Max retries reached. Exiting application...');
      process.exit(1);
    }
  }
};
