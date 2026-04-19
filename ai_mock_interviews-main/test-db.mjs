import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Force reload env
dotenv.config({ path: path.join(process.cwd(), '.env.local'), override: true });

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  console.log('Testing connection to:', MONGODB_URI?.split('@')[1] || 'Unknown');
  
  if (!MONGODB_URI || MONGODB_URI.includes('<username>')) {
    console.error('Error: MONGODB_URI is missing or contains placeholders.');
    process.exit(1);
  }

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
