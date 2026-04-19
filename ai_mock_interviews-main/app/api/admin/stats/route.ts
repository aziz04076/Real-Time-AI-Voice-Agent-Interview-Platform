import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import Interview from "@/lib/models/interview.model";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    // Check if the user is authorized (either role === 'admin' or isAdmin === true)
    if (!currentUser || (currentUser.role !== "admin" && !currentUser.isAdmin)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const totalUsers = await User.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    
    const users = await User.find();
    let sumScore = 0;
    
    // Calculate average score dynamically from either total score recorded in users or interviews
    const interviews = await Interview.find();
    if (interviews.length > 0) {
      const totalScore = interviews.reduce((acc, curr) => acc + (curr.score || 0), 0);
      sumScore = totalScore / interviews.length;
    }

    const proUsers = await User.countDocuments({ plan: "pro" });

    // Active users in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await User.countDocuments({ lastActive: { $gte: sevenDaysAgo } });

    return NextResponse.json({
      totalUsers,
      totalInterviews,
      averageScore: Math.round(sumScore),
      proUsers,
      activeUsers,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
