import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://azizirfan387_db_user:6DPIBctffQYGfCsh@cluster0.zie5u8z.mongodb.net/prepwise?appName=Cluster0";

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
