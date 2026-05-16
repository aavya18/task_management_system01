const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    // Try to connect to the provided URI first with a short timeout
    try {
        if (!mongoUri) throw new Error("No MONGO_URI provided");
        const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return;
    } catch (err) {
        console.log("Could not connect to external/local MongoDB. Starting in-memory database...");
    }

    // Fallback to in-memory server
    process.env.MONGOMS_VERSION = '7.0.3';
    const mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.3'
      }
    });
    mongoUri = mongoServer.getUri();
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
