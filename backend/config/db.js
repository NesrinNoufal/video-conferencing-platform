import mongoose from 'mongoose';


const connectToDb = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/video-conferencing');
    // console.log('Connected to MongoDB');
  } catch (error) {
    // console.error('Failed to connect to MongoDB:', error);
  }
};

export default connectToDb;
