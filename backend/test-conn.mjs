import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://azizirfan387_db_user:6DPIBctffQYGfCsh@cluster0-shard-00-00.zie5u8z.mongodb.net:27017,cluster0-shard-00-01.zie5u8z.mongodb.net:27017,cluster0-shard-00-02.zie5u8z.mongodb.net:27017/prepwise?ssl=true&replicaSet=atlas-zie5u8z-shard-0&authSource=admin&appName=Cluster0";

async function testConnection() {
  console.log('Testing connection to cluster...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('SUCCESS: Connected to MongoDB');
    await mongoose.disconnect();
    console.log('Disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('FAILURE: Could not connect to MongoDB');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
