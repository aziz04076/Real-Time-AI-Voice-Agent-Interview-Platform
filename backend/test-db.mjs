import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

let MONGODB_URI = process.env.MONGODB_URI;

// Manually parse .env.local to avoid third-party dependencies (like 'dotenv')
try {
  let envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    envPath = path.join(process.cwd(), 'frontend', '.env.local');
  }
  if (!fs.existsSync(envPath)) {
    envPath = path.join(process.cwd(), '..', 'frontend', '.env.local');
  }
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split(/\r?\n/);
    for (const line of lines) {
      if (line.trim().startsWith('MONGODB_URI=')) {
        MONGODB_URI = line.substring(line.indexOf('=') + 1).trim();
        break;
      }
    }
  }
} catch (err) {
  console.warn('Warning: Could not read .env.local file.', err.message);
}

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
