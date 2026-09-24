import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import Interview from "@/lib/models/interview.model";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== "admin" && !currentUser.isAdmin)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Generate past 7 days ranges
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Aggregate interviews per day
    const interviewsByDay = await Interview.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo, $lte: today }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          avgScore: { $avg: "$score" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Aggregate user registrations per day
    const usersByDay = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo, $lte: today }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Most common interview types
    const interviewTypes = await Interview.aggregate([
      {
        $group: {
          _id: "$interviewType",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    // Format time series data to ensure all 7 days are represented, even if 0
    const timeSeriesData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      
      const intData = interviewsByDay.find(i => i._id === dateStr);
      const usrData = usersByDay.find(u => u._id === dateStr);
      
      timeSeriesData.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        interviews: intData ? intData.count : 0,
        averageScore: intData && intData.avgScore ? Math.round(intData.avgScore) : 0,
        newUsers: usrData ? usrData.count : 0,
      });
    }

    return NextResponse.json({
      timeSeriesData,
      topInterviewTypes: interviewTypes.map(t => ({ name: t._id || 'unknown', count: t.count }))
    });

  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
