"use server";

import { connectToDatabase } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import Interview from "@/lib/models/interview.model";
import Feedback from "@/lib/models/feedback.model";

export async function getAdminStats() {
  try {
    await connectToDatabase();

    const totalUsers = await User.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    const proUsers = await User.countDocuments({ isPro: true }); // Assuming isPro exists or defaults to false
    
    const allFeedback = await Feedback.find({}, "totalScore");
    const avgScore = allFeedback.length > 0 
      ? Math.round(allFeedback.reduce((acc, f) => acc + f.totalScore, 0) / allFeedback.length)
      : 0;

    return {
      totalUsers,
      totalInterviews,
      avgScore,
      proUsers,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalUsers: 0,
      totalInterviews: 0,
      avgScore: 0,
      proUsers: 0,
    };
  }
}

export async function getAllUsersWithStats() {
  try {
    await connectToDatabase();
    
    const users = await User.find().sort({ createdAt: -1 });
    
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const interviewCount = await Interview.countDocuments({ userId: user._id.toString() });
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        status: user.isPro ? "Pro" : (user.isAdmin ? "Admin" : "Free"),
        interviewCount,
        lastActive: "Recently", // Simplified for now
      };
    }));

    return usersWithStats;
  } catch (error) {
    console.error("Error fetching users with stats:", error);
    return [];
  }
}
