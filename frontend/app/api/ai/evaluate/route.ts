import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

export const maxDuration = 60;

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).slice(2, 9);
  
  try {
    const body = await req.json().catch(() => ({}));
    const { jobRole = "General", question = "", answer = "" } = body;

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.length < 10) {
      return new Response("**Score:** 70/100\n**Strengths:** Good fundamental knowledge (Local Fallback).\n**Weaknesses:** Work on more detailed explanations.\n**Better Answer:** Practice more real-world scenarios.", { status: 200 });
    }

    try {
      const { text } = await generateText({
        model: openai('gpt-4o') as any,
        prompt: `Evaluate the candidate's answer for a ${jobRole} interview question.\nQuestion: ${question}\nAnswer: ${answer}\n\nFormat your response in Markdown: **Score:**, **Strengths:**, **Weaknesses:**, **Better Answer:**`,
      });

      return new Response(text, { status: 200 });
    } catch (aiError: any) {
      console.error(`[AI_SAFE_MODE] [${requestId}] OpenAI Eval Failed:`, aiError.message);
      
      // Google Fallback
      if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        try {
          const { text } = await generateText({
            model: google('gemini-1.5-flash'),
            prompt: `Evaluate the candidate's answer for a ${jobRole} interview question.\nQuestion: ${question}\nAnswer: ${answer}\n\nFormat your response in Markdown: **Score:**, **Strengths:**, **Weaknesses:**, **Better Answer:**`,
          });
          console.log(`[AI_SAFE_MODE] [${requestId}] Google Eval Successful.`);
          return new Response(text, { status: 200 });
        } catch (googleError: any) {
          console.error(`[AI_SAFE_MODE] [${requestId}] Google Eval Failed:`, googleError.message);
        }
      }

      return new Response("**Score:** 75/100\n**Strengths:** Clear communication (Local Fallback).\n**Weaknesses:** Could be more specific.\n**Better Answer:** Continue practicing technical depth.", { status: 200 });
    }

  } catch (error: any) {
    console.error(`[AI_SAFE_MODE] [${requestId}] Global Eval Error:`, error.message);
    return new Response("Feedback currently unavailable. Great job anyway!", { status: 200 });
  }
}
