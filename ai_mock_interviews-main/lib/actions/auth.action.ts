"use server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import User from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 1 week

export async function signUp(params: SignUpParams) {
  const { name, email, password } = params;

  try {
    await connectToDatabase();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password!, 10);

    // Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("DEBUG - Error creating user:", error);
    return {
      success: false,
      message: `Failed to create account: ${error.message || "Please try again."}`,
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, password } = params;

  try {
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };
    }

    const isPasswordValid = await bcrypt.compare(password!, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid credentials.",
      };
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: SESSION_DURATION }
    );

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      maxAge: SESSION_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return { 
      success: true,
      isAdmin: user.role === "admin" || user.isAdmin,
      role: user.role
    };
  } catch (error: any) {
    console.error("DEBUG - Error signing in:", error);
    return {
      success: false,
      message: `Failed to log into account: ${error.message || "Please try again."}`,
    };
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      console.log("[getCurrentUser] No token found in cookies.");
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    await connectToDatabase();
    const userDoc = await User.findById(decoded.userId).select("-password");
    
    if (!userDoc) {
      console.log("[getCurrentUser] No userDoc found for ID:", decoded.userId);
      return null;
    }

    return {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role,
      plan: userDoc.plan,
      isAdmin: userDoc.isAdmin,
      isPro: userDoc.isPro,
      isBlocked: userDoc.isBlocked,
    } as User;
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return null;
    } else {
      console.error("[getCurrentUser] Error verifying token or querying DB:", error?.message || error);
    }
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
