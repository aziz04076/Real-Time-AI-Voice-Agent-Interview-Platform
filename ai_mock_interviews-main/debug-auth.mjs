import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = "mongodb+srv://azizirfan387_db_user:6DPIBctffQYGfCsh@cluster0.zie5u8z.mongodb.net/prepwise?appName=Cluster0";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function debugSignUp() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const email = "test" + Date.now() + "@example.com";
    const password = "password123";
    const name = "Test User";

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed.');

    console.log('Creating user...');
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log('User created:', newUser._id);

    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (error) {
    console.error('ERROR IN SIGNUP:', error);
  }
}

debugSignUp();
