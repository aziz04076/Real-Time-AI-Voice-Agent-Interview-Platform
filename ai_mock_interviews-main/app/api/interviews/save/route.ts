import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Interview from "@/lib/models/interview.model";
import User from "@/lib/models/user.model";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { 
      jobRole, 
      field, 
      questions, 
      answers, 
      duration, 
      score, 
      overallFeedback, 
      strengths, 
      weaknesses, 
      areasToImprove,
      resumeSummary 
    } = body;

    await connectToDatabase();

    // Create the fully structured interview record with consolidated feedback
    const newInterview = await Interview.create({
      userId: user.id,
      role: field || "General", // Legacy compatibility
      jobRole: jobRole || "General",
      type: field || "General", // Legacy compatibility
      field: field || "General",
      interviewType: "interview",
      score: score || 0,
      overallFeedback: overallFeedback || "",
      strengths: strengths || "",
      weaknesses: weaknesses || "",
      areasToImprove: areasToImprove || "",
      duration: duration || 0,
      questions: questions || [],
      answers: answers || [], // Array of { question, answer }
      resumeSummary: resumeSummary || "",
      finalized: true,
      createdAt: new Date(),
    });

    // Update user stats
    await User.findByIdAndUpdate(user.id, {
      $inc: { "stats.interviewsCompleted": 1 }
    });

    return Response.json({ success: true, interviewId: newInterview._id });
  } catch (error: any) {
    console.error("[SAVE_INTERVIEW_ERROR]", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
