const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // Try to connect to the provided URI first
    if (mongoUri && (mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://'))) {
      try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
        console.log('MongoDB Atlas connected successfully');
        return;
      } catch (err) {
        console.log('Could not connect to external MongoDB. Falling back to in-memory database...');
      }
    }

    // Fallback: in-memory MongoDB
    process.env.MONGOMS_VERSION = '7.0.3';
    const mongoServer = await MongoMemoryServer.create({
      binary: { version: '7.0.3' }
    });
    mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('In-Memory MongoDB connected successfully');
  } catch (error) {
    console.error(`DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
