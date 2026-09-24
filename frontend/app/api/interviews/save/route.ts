
import { connectToDatabase } from "@/lib/mongoose";
import Interview from "@/lib/models/interview.model";
import Feedback from "@/lib/models/feedback.model";
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
      answers, // Array of evaluated answers
      duration, 
      score, 
      communicationScore,
      technicalScore,
      problemSolvingScore,
      confidenceScore,
      hiringRecommendation,
      recommendedTopics,
      overallFeedback, 
      strengths, 
      weaknesses, 
      areasToImprove,
      resumeSummary 
    } = body;

    await connectToDatabase();

    // 1. Create the Interview document
    const newInterview = await Interview.create({
      userId: user.id,
      role: field || "General", // Legacy compatibility
      jobRole: jobRole || "General",
      type: field || "General", // Legacy compatibility
      field: field || "General",
      interviewType: "interview",
      score: score || 0,
      communicationScore: communicationScore || 0,
      technicalScore: technicalScore || 0,
      problemSolvingScore: problemSolvingScore || 0,
      confidenceScore: confidenceScore || 0,
      hiringRecommendation: hiringRecommendation || "",
      recommendedTopics: recommendedTopics || [],
      overallFeedback: overallFeedback || "",
      strengths: Array.isArray(strengths) ? strengths.join("; ") : (strengths || ""),
      weaknesses: Array.isArray(weaknesses) ? weaknesses.join("; ") : (weaknesses || ""),
      areasToImprove: Array.isArray(areasToImprove) ? areasToImprove.join("; ") : (areasToImprove || ""),
      duration: duration || 0,
      totalQuestions: questions?.length || 0,
      questions: questions || [],
      answers: (answers || []).map((ans: any) => ({
        question: ans.question,
        answer: ans.answer,
        score: ans.score || 0,
        technicalCorrectness: ans.technicalCorrectness || "partially correct",
        strengths: Array.isArray(ans.strengths) ? ans.strengths.join("; ") : (ans.strengths || ""),
        weaknesses: Array.isArray(ans.weaknesses) ? ans.weaknesses.join("; ") : (ans.weaknesses || ""),
        missingPoints: Array.isArray(ans.missingPoints) ? ans.missingPoints.join("; ") : (ans.missingPoints || ""),
        improvementSuggestions: Array.isArray(ans.improvementSuggestions) ? ans.improvementSuggestions.join("; ") : (ans.improvementSuggestions || ""),
        betterAnswer: ans.betterAnswer || ""
      })),
      resumeSummary: resumeSummary || "",
      finalized: true,
      createdAt: new Date(),
    });

    // 2. Create the Feedback document so the feedback/report page shows it correctly
    await Feedback.create({
      interviewId: newInterview._id.toString(),
      userId: user.id,
      totalScore: score || 0,
      categoryScores: [
        { 
          name: "Technical Depth", 
          score: technicalScore || score || 0, 
          comment: `Demonstrated technical performance corresponding to a score of ${technicalScore || score || 0}%.` 
        },
        { 
          name: "Communication", 
          score: communicationScore || score || 0, 
          comment: `Overall communication clarity was evaluated at ${communicationScore || score || 0}%.` 
        },
        { 
          name: "Problem Solving", 
          score: problemSolvingScore || score || 0, 
          comment: `Problem solving capabilities and structural approach scored at ${problemSolvingScore || score || 0}%.` 
        },
        { 
          name: "Confidence", 
          score: confidenceScore || score || 0, 
          comment: `Presentation poise and confidence was graded at ${confidenceScore || score || 0}%.` 
        }
      ],
      strengths: Array.isArray(strengths) ? strengths : (strengths ? [strengths] : []),
      areasForImprovement: Array.isArray(areasToImprove) ? areasToImprove : (areasToImprove ? [areasToImprove] : []),
      finalAssessment: `${overallFeedback || "Mock interview session completed."} Hiring Recommendation: ${hiringRecommendation || "No recommendation provided"}.`
    });

    // 3. Update user stats
    await User.findByIdAndUpdate(user.id, {
      $inc: { "stats.interviewsCompleted": 1 }
    });

    return Response.json({ success: true, interviewId: newInterview._id });
  } catch (error: any) {
    console.error("[SAVE_INTERVIEW_ERROR]", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
