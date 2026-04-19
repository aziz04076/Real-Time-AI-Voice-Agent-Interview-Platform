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
    correctness: z.enum(['correct', 'partially correct', 'incorrect']),
    explanation: z.string(),
    score: z.number().min(0).max(100),
    betterAnswer: z.string()
  })),
  overallScore: z.number().min(0).max(100),
  strengths: z.string(),
  weaknesses: z.string(),
  improvementSuggestions: z.string(),
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

    const systemPrompt = `You are a strict technical interviewer evaluating a mock interview for the role of ${jobRole}.

Evaluation Rules:
1. Be Honest and Critical: Do not give positive feedback unless the answer actually demonstrates good understanding.
2. Penalize Weak Answers: If an answer is extremely short (e.g., "yes", "i don't know"), irrelevant, or incorrect, mark it as 'incorrect' and give it a score below 20.
3. Realistic Scoring:
   0-40: Poor
   41-60: Average
   61-80: Good
   81-100: Excellent
4. For each question, provide a 'betterAnswer' example only for the weakest responses (or leave it empty if the answer was already excellent).`;

    const userPrompt = `Evaluate the following interview conversation:
${conversationStr}`;

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

    // 3. Final Hardcoded Fallback (JSON version)
    const fallbackObj = {
      questionEvaluations: questions.map((q: string, i: number) => ({
        question: q,
        answer: answers[i] || "No answer provided",
        correctness: "partially correct",
        explanation: "The response was minimal. In a real interview, you should provide more technical depth and specific examples.",
        score: answers[i] ? 50 : 0,
        betterAnswer: "Provide a detailed explanation using the STAR method (Situation, Task, Action, Result)."
      })),
      overallScore: 40,
      strengths: "Communicated basic intent.",
      weaknesses: "Lack of technical depth, concise answers, and missing professional context.",
      improvementSuggestions: "Practice elaborating on technical concepts and using real-world examples.",
      overallFeedback: "The performance was below expectations. Focus on building structured responses and demonstrating core competencies."
    };

    console.log(`[AI_STREAMS] [${requestId}] Using hardcoded JSON fallback.`);
    return Response.json(fallbackObj);

  } catch (error: any) {
    console.error(`[AI_STREAMS] [${requestId}] Global Eval Error:`, error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
