"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { connectToDatabase } from "@/lib/mongoose";
import Interview from "@/lib/models/interview.model";
import Feedback, { IFeedback } from "@/lib/models/feedback.model";

export async function createFeedback(params: CreateFeedbackParams) {
  try {
    await connectToDatabase();
    
    // Check if feedback already exists
    const existing = await Feedback.findOne({ interviewId: params.interviewId });
    
    // If feedback exists but we are 'retaking', we should either update it or allow a new one.
    // Given the current schema, we'll update it to keep one feedback per interview.

    console.log("🤖 Generating Real AI Feedback from transcript...");

    const transcriptText = params.transcript
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    const { createOpenAI } = await import("@ai-sdk/openai");
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const { text } = await generateText({
      model: openai("gpt-4o") as any, // Use gpt-4o for better analysis
      system: `You are a Senior Technical Recruiter and Hiring Manager.
Analyze the following interview transcript and provide a structured assessment in JSON format.

JSON STRUCTURE:
{
  "totalScore": number (0-100),
  "categoryScores": [
    { "name": "Technical Depth", "score": number, "comment": "string" },
    { "name": "Communication", "score": number, "comment": "string" },
    { "name": "Problem Solving", "score": number, "comment": "string" },
    { "name": "Confidence", "score": number, "comment": "string" }
  ],
  "strengths": ["string", "string", "string"],
  "areasForImprovement": ["string", "string", "string"],
  "finalAssessment": "A 2-3 sentence summary of the candidate's performance."
}

CRITICAL: Return ONLY the JSON object. No markdown, no wrappers.`,
      prompt: `Interview Transcript:\n${transcriptText}`,
    });

    let feedbackData;
    try {
      feedbackData = JSON.parse(text.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", text);
      throw new Error("Invalid AI response format");
    }

    if (existing) {
      await Feedback.findByIdAndUpdate(existing._id, { ...feedbackData, createdAt: new Date() });
      await Interview.findByIdAndUpdate(params.interviewId, { finalized: true });
      return { success: true, feedbackId: existing._id.toString() };
    }

    const newFeedback = await Feedback.create({
      interviewId: params.interviewId,
      userId: params.userId,
      ...feedbackData,
    });

    // Mark interview as finalized
    await Interview.findByIdAndUpdate(params.interviewId, { finalized: true });

    return { success: true, feedbackId: newFeedback._id.toString() };
  } catch (error: any) {
    console.error("❌ Critical error generating/saving feedback:", error?.message || error);
    return { success: false };
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<IFeedback | null> {
  await connectToDatabase();
  const feedback = await Feedback.findOne({ interviewId: params.interviewId, userId: params.userId });
  if (!feedback) return null;

  return {
    ...feedback.toObject(),
    id: feedback._id.toString(),
  } as any;
}

export async function getQuestionsForRole(branch: string, role: string, company: string): Promise<string[]> {
  try {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Generate 10 interview questions for ${role} at ${company} in ${branch}. Return as bulleted list.`,
    });

    return text.split("\n").map(q => q.replace(/^[*-]\s*/, "").trim()).filter(Boolean).slice(0, 10);
  } catch (error) {
    return ["Tell me about yourself.", "What are your strengths?"];
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  await connectToDatabase();
  const interview = await Interview.findById(id);
  if (!interview) return null;
  
  return {
    id: interview._id.toString(),
    userId: interview.userId,
    role: interview.role,
    type: interview.type,
    techstack: interview.techstack,
    level: interview.level,
    questions: interview.questions,
    finalized: interview.finalized,
    createdAt: interview.createdAt.toISOString(),
  } as Interview;
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
  await connectToDatabase();
  const interviews = await Interview.find({ userId: params.userId }).sort({ createdAt: -1 }).limit(10);
  return interviews.map(i => ({
    id: i._id.toString(),
    userId: i.userId,
    role: i.jobRole || i.role,
    jobRole: i.jobRole || i.role,
    type: i.field || i.type,
    field: i.field || i.type,
    techstack: i.techstack,
    level: i.level,
    questions: i.questions,
    finalized: i.finalized,
    score: i.score,
    overallFeedback: i.overallFeedback || i.feedback,
    createdAt: i.createdAt.toISOString(),
  } as Interview));
}

export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
  await connectToDatabase();
  const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
  return interviews.map(i => ({
    id: i._id.toString(),
    userId: i.userId,
    role: i.jobRole || i.role,
    jobRole: i.jobRole || i.role,
    type: i.field || i.type,
    field: i.field || i.type,
    techstack: i.techstack,
    level: i.level,
    questions: i.questions,
    finalized: i.finalized,
    score: i.score,
    overallFeedback: i.overallFeedback || i.feedback,
    createdAt: i.createdAt.toISOString(),
  } as Interview));
}

export async function resetInterview(interviewId: string) {
  try {
    await connectToDatabase();
    await Feedback.deleteOne({ interviewId });
    await Interview.findByIdAndUpdate(interviewId, { finalized: false });
    return { success: true };
  } catch (error) {
    console.error("Error resetting interview:", error);
    return { success: false };
  }
}
