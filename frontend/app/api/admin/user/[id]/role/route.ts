import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import User from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/mongoose";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminUser = await getCurrentUser();
    
    if (!adminUser || (adminUser.role !== "admin" && !adminUser.isAdmin)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    if (adminUser.id === id) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
    }

    const body = await req.json();
    const { role } = body;

    if (role !== "admin" && role !== "user") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await connectToDatabase();
    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    userToUpdate.role = role;
    userToUpdate.isAdmin = role === "admin";
    
    await userToUpdate.save();

    return NextResponse.json({ success: true, user: userToUpdate });
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role", details: error.message },
      { status: 500 }
    );
  }
}
