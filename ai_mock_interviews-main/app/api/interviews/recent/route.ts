import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Interview from "@/lib/models/interview.model";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    
    // Fetch last 10 interviews for the user
    // Only return finalized/completed ones if that logic applies, but we'll fetch all.
    const interviews = await Interview.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("Error fetching recent interviews:", error);
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
  }
}
