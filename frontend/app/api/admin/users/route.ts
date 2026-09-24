import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== "admin" && !currentUser.isAdmin)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const plan = searchParams.get("plan") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt";

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (plan && plan !== "all") {
      query.plan = plan;
    }

    const sortConfig: any = {};
    if (sortBy === "interviewsTaken" || sortBy === "lastActive" || sortBy === "createdAt") {
      sortConfig[sortBy] = -1; // Descending
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .sort(sortConfig)
      .skip(skip)
      .limit(limit)
      .select("-password");

    const total = await User.countDocuments(query);

    return NextResponse.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalUsers: total,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
