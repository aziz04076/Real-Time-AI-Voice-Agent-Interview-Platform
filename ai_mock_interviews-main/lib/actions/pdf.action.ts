"use server";

import { generateInterviewPDF } from "@/lib/pdf-generator";

export async function downloadReportAction(feedback: Feedback, interview: Interview) {
  try {
    const base64 = await generateInterviewPDF(feedback, interview);
    return base64;
  } catch (error) {
    console.error("PDF Action Error:", error);
    throw new Error("Failed to generate report");
  }
}
