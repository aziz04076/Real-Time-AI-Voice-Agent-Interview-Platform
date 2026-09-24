import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== "admin" && !currentUser.isAdmin)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Prevent blocking oneself
    if (currentUser.id === id) {
      return NextResponse.json({ error: "Cannot block your own admin account" }, { status: 400 });
    }

    const body = await request.json();
    const { isBlocked } = body;

    if (typeof isBlocked !== "boolean") {
      return NextResponse.json({ error: "Invalid block status" }, { status: 400 });
    }

    await connectToDatabase();
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isBlocked },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const statusText = isBlocked ? "blocked" : "unblocked";
    return NextResponse.json({ success: true, message: `User ${statusText} successfully` });
  } catch (error) {
    console.error("Error updating user block status:", error);
    return NextResponse.json({ error: "Failed to update user block status" }, { status: 500 });
  }
}
