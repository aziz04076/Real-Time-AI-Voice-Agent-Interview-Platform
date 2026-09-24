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
    const previousQuestions: string[] = body.previousQuestions || [];
    const previousAnswers: string[] = body.previousAnswers || [];

    console.log(`[AI_STREAMS] [${requestId}] Adaptive question request for ${jobRole} at ${company}`);

    // Tier 1: Key Check
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.length < 10) {
      return new Response(getFallbackQuestion(jobRole, field, company), { status: 200 });
    }

    // Build the history representation
    let historyStr = "";
    if (previousQuestions.length > 0) {
      historyStr = previousQuestions.map((q, i) => {
        const a = previousAnswers[i] || "[No answer or skipped]";
        return `Question ${i + 1}: ${q}\nAnswer ${i + 1}: ${a}`;
      }).join("\n\n");
    } else {
      historyStr = "No questions have been asked yet. This is the start of the interview.";
    }

    const systemPrompt = `You are an expert technical interviewer for the role of ${jobRole} at ${company}.
Your goal is to conduct a highly professional, adaptive, and interactive mock interview.

Current Context:
- Academic Field: ${field}
- Candidate Background/Skills: ${resumeSummary}

Interview Rules:
1. **Adaptive Difficulty**: Assess the candidate's last answer in the history (if any). If the answer was technically strong and detailed, increase the complexity/difficulty of the next question. If the candidate struggled, gave a very short answer, or said they didn't know, decrease the difficulty or ask a foundational question to guide them back.
2. **Strict Non-Repetition**: Do NOT ask the same question twice or cover the same specific sub-topic again. Read the previously asked questions carefully:
${previousQuestions.map((q, idx) => `  - [Asked ${idx + 1}]: ${q}`).join("\n")}
3. **Conversational Flow**: Act like a human interviewer. Acknowledge their last response briefly (e.g., "Good point on X," or "That makes sense," or "Let's pivot slightly") and transition naturally. Do not say "Question X:" or output headers.
4. **Diversity**: Cover different topics within the domain (e.g., coding principles, system design, databases, problem-solving, behavioral).
5. **No Metadata**: Output ONLY the raw next question text. No extra formatting, no markdown headers, no introductory commentary.`;

    const prompt = `Here is the interview history so far:\n\n${historyStr}\n\nBased on this history, generate the next unique, adaptive question for the candidate.`;

    try {
      // Tier 2: AI Attempt (OpenAI)
      const { text } = await generateText({
        model: openai('gpt-4o-mini') as any,
        system: systemPrompt,
        prompt: prompt,
        temperature: 0.7,
      });

      // Post-process to ensure it isn't an exact match or extremely similar to previous questions
      const cleanedText = text.trim();
      const isRepeated = previousQuestions.some(pq => 
        cleanedText.toLowerCase() === pq.toLowerCase() || 
        pq.toLowerCase().includes(cleanedText.toLowerCase()) || 
        cleanedText.toLowerCase().includes(pq.toLowerCase())
      );

      if (isRepeated) {
        console.warn(`[AI_STREAMS] [${requestId}] Detected repeated question from OpenAI. Retrying...`);
        throw new Error("Repeated question generated");
      }

      return new Response(cleanedText, { status: 200 });
    } catch (aiError: any) {
      console.error(`[AI_STREAMS] [${requestId}] OpenAI Error/Retry:`, aiError.message);
      
      // Tier 3: Google Fallback
      if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        try {
          const { text } = await generateText({
            model: google('gemini-1.5-flash'),
            system: systemPrompt,
            prompt: prompt,
            temperature: 0.7,
          });
          console.log(`[AI_STREAMS] [${requestId}] Google Fallback Successful.`);
          return new Response(text.trim(), { status: 200 });
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
