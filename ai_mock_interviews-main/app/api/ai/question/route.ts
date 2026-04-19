import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { getFallbackQuestion } from '../../../../lib/fallbacks';

export const maxDuration = 60;

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).slice(2, 9);
  
  let jobRole = "General";
  let field = "General";
  let company = "";

  try {
    const body = await req.json().catch(() => ({}));
    jobRole = body.jobRole || "General";
    field = body.field || "General";
    company = body.company || "";
    const resumeSummary = body.resumeSummary || "";
    const previousQuestions = body.previousQuestions || [];

    console.log(`[AI_STREAMS] [${requestId}] Question request for ${jobRole} at ${company}`);

    // Tier 1: Key Check
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.length < 10) {
      return new Response(getFallbackQuestion(jobRole, field, company), { status: 200 });
    }

    try {
      // Tier 2: AI Attempt (OpenAI)
      const { text } = await generateText({
        model: openai('gpt-4o-mini') as any,
        prompt: `Generate one interview question for ${jobRole}. Role context: ${resumeSummary}. Field: ${field}. Avoid: ${previousQuestions.join('|')}.`,
        temperature: 0.7,
      });

      return new Response(text, { status: 200 });
    } catch (aiError: any) {
      console.error(`[AI_STREAMS] [${requestId}] OpenAI Error:`, aiError.message);
      
      // Tier 3: Google Fallback
      if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        try {
          const { text } = await generateText({
            model: google('gemini-1.5-flash'),
            prompt: `Generate one interview question for ${jobRole}. Role context: ${resumeSummary}. Field: ${field}. Avoid: ${previousQuestions.join('|')}.`,
            temperature: 0.7,
          });
          console.log(`[AI_STREAMS] [${requestId}] Google Fallback Successful.`);
          return new Response(text, { status: 200 });
        } catch (googleError: any) {
          console.error(`[AI_STREAMS] [${requestId}] Google Fallback Failed:`, googleError.message);
        }
      }

      // Tier 4: Hardcoded Fallback
      return new Response(getFallbackQuestion(jobRole, field, company), { status: 200 });
    }
  } catch (error: any) {
    console.error(`[AI_STREAMS] [${requestId}] Global Error:`, error.message);
    return new Response(getFallbackQuestion(jobRole, field, company), { status: 200 });
  }
}
