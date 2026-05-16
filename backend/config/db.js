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
        if (process.env.NODE_ENV === 'production') {
            console.error('\n======================================================');
            console.error('PRODUCTION ERROR: Failed to connect to MongoDB.');
            console.error('Please add a MongoDB service to your Railway project');
            console.error('and ensure the MONGO_URI environment variable is set.');
            console.error('======================================================\n');
            process.exit(1);
        }
        console.log("Could not connect to external/local MongoDB. Starting in-memory database...");
    }

    // Fallback to in-memory server (Development only)
    const mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
