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

    const body = await request.json();
    const { plan } = body;

    if (plan !== "free" && plan !== "pro") {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Update map legacy isPro flag as well
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { plan, isPro: plan === "pro" },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `User plan updated to ${plan}` });
  } catch (error) {
    console.error("Error updating user plan:", error);
    return NextResponse.json({ error: "Failed to update user plan" }, { status: 500 });
  }
}
