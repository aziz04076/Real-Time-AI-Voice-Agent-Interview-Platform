import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export const maxDuration = 60;

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const EvaluationSchema = z.object({
  questionEvaluations: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    technicalCorrectness: z.enum(['correct', 'partially correct', 'incorrect']),
    explanation: z.string(),
    score: z.number().min(0).max(100),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    missingPoints: z.array(z.string()),
    improvementSuggestions: z.array(z.string()),
    betterAnswer: z.string(),
    overallFeedback: z.string()
  })),
  overallScore: z.number().min(0).max(100),
  communicationScore: z.number().min(0).max(100),
  technicalScore: z.number().min(0).max(100),
  problemSolvingScore: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvementSuggestions: z.array(z.string()),
  recommendedTopics: z.array(z.string()),
  hiringRecommendation: z.enum(['Strong Hire', 'Hire', 'Borderline', 'No Hire']),
  overallFeedback: z.string()
});

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).slice(2, 9);
  console.log(`[AI_STREAMS] [${requestId}] [STRICT_EVALUATE] Started.`);

  try {
    const body = await req.json().catch(() => ({}));
    const { jobRole = "General", questions = [], answers = [] } = body;

    if (questions.length === 0) {
      return new Response(JSON.stringify({ error: "No questions to evaluate" }), { status: 400 });
    }

    const conversationStr = questions.map((q: string, i: number) => {
      return `Q: ${q}\nA: ${answers[i] || "No answer provided."}`;
    }).join('\n\n');

    const systemPrompt = `You are an expert technical interviewer evaluating a mock interview for the role of ${jobRole}.
You need to generate a highly detailed and honest performance report.

Evaluation Rules:
1. **Critical & Realistic Scoring**: 
   - Poor answers (extremely short, incorrect, or "I don't know") MUST be scored between 0 and 30.
   - Average answers showing basic knowledge but lacking depth: 40-60.
   - Good technical answers with solid concepts: 65-80.
   - Excellent, production-ready, or highly detailed answers with real-world context: 81-100.
   - Identical scores for different questions is highly discouraged. Evaluate each answer individually.
2. **Category Scores**: Calculate Communication, Technical, Problem Solving, and Confidence scores based on the conversation.
3. **Structured Answer Analysis**: For each question, analyze the correctness, key strengths, weaknesses, missing technical points, and provide a concrete better answer example.
4. **Hiring Recommendation**: Decide between 'Strong Hire', 'Hire', 'Borderline', 'No Hire' based on technical capability.`;

    const userPrompt = `Evaluate the following interview conversation:\n\n${conversationStr}`;

    // 1. Try OpenAI
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 20) {
      try {
        const { object } = await generateObject({
          model: openai('gpt-4o') as any,
          schema: EvaluationSchema,
          system: systemPrompt,
          prompt: userPrompt,
        });
        console.log(`[AI_STREAMS] [${requestId}] OpenAI strict evaluation successful.`);
        return Response.json(object);
      } catch (e: any) {
        console.error(`[AI_STREAMS] [${requestId}] OpenAI strict evaluation failed:`, e.message);
      }
    }

    // 2. Try Google Fallback
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      try {
        const { object } = await generateObject({
          model: google('gemini-1.5-pro'),
          schema: EvaluationSchema,
          system: systemPrompt,
          prompt: userPrompt,
        });
        console.log(`[AI_STREAMS] [${requestId}] Google strict evaluation successful.`);
        return Response.json(object);
      } catch (e: any) {
        console.error(`[AI_STREAMS] [${requestId}] Google strict evaluation failed:`, e.message);
      }
    }

    // 3. Dynamic Fallback when APIs fail
    console.log(`[AI_STREAMS] [${requestId}] Using dynamic fallback generator.`);
    const fallbackEvaluations = questions.map((q: string, i: number) => {
      const answer = answers[i] || "";
      const isShort = answer.trim().length < 15;
      const isNone = !answer || answer.toLowerCase().includes("don't know") || answer.toLowerCase().includes("dont know");
      
      let score = 70;
      let correctness: 'correct' | 'partially correct' | 'incorrect' = "correct";
      let explanation = "Solid attempt. The response explains the core concept.";
      
      if (isNone) {
        score = 10;
        correctness = "incorrect";
        explanation = "The candidate did not answer the question.";
      } else if (isShort) {
        score = 40;
        correctness = "partially correct";
        explanation = "The answer was very brief and lacked technical depth.";
      }

      return {
        question: q,
        answer: answer || "No answer provided",
        technicalCorrectness: correctness,
        explanation: explanation,
        score: score,
        strengths: isNone ? [] : ["Acknowledged the question topic"],
        weaknesses: isShort || isNone ? ["Lacked technical terminology", "Answer was too brief"] : [],
        missingPoints: isShort || isNone ? ["Detailed concepts", "Real-world examples"] : [],
        improvementSuggestions: ["Elaborate more on concepts using the STAR methodology (Situation, Task, Action, Result)"],
        betterAnswer: "Provide a detailed answer with technical details and structure.",
        overallFeedback: explanation
      };
    });

    const averageScore = Math.round(fallbackEvaluations.reduce((sum, item) => sum + item.score, 0) / fallbackEvaluations.length);

    const fallbackObj = {
      questionEvaluations: fallbackEvaluations,
      overallScore: averageScore,
      communicationScore: Math.max(40, averageScore - 5),
      technicalScore: averageScore,
      problemSolvingScore: Math.max(40, averageScore - 10),
      confidenceScore: Math.max(50, averageScore + 5),
      strengths: ["Willingness to practice", "Basic domain coverage"],
      weaknesses: ["Brief answers", "Missing depth in technical concepts"],
      improvementSuggestions: ["Focus on structured answering templates", "Review core domain terms"],
      recommendedTopics: [`Core ${jobRole} Principles`],
      hiringRecommendation: averageScore > 75 ? "Hire" : averageScore > 50 ? "Borderline" : "No Hire",
      overallFeedback: "Dynamic fallback generated. Focus on elaborating answers with technical detail."
    };

    return Response.json(fallbackObj);

  } catch (error: any) {
    console.error(`[AI_STREAMS] [${requestId}] Global Eval Error:`, error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
