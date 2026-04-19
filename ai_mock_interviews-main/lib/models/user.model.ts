import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: string;
  plan: string;
  isPro?: boolean;
  isAdmin?: boolean;
  interviewsTaken: number;
  averageScore: number;
  lastActive: Date;
  isBlocked: boolean;
  createdAt: Date;
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  plan: { type: String, enum: ["free", "pro"], default: "free" },
  isPro: { type: Boolean, default: false }, // Keeping for backward compatibility
  isAdmin: { type: Boolean, default: false }, // Keeping for backward compatibility
  interviewsTaken: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = models?.User || model("User", UserSchema);

export default User;
