import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stockanalyzer';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    // Don't crash the server — app works without DB (signals still work)
  }
  const conn = await mongoose.connect(uri);
  console.log("Mongo Connected");
  console.log("Database:", conn.connection.name);
  console.log("Host:", conn.connection.host);
};

export default connectDB;
