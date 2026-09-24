import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generateInterviewPDF(feedback: Feedback, interview: Interview) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([600, 850]);
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const primaryColor = rgb(0.3, 0.3, 1); // #4d4dff
  const darkColor = rgb(0.1, 0.1, 0.2);

  // --- Background Decor ---
  page.drawRectangle({
    x: 0,
    y: height - 100,
    width,
    height: 100,
    color: darkColor,
  });

  // --- Header ---
  page.drawText("PREPWISE AI ASSESSMENT", {
    x: 40,
    y: height - 60,
    size: 28,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  page.drawText("PRO PERFORMANCE REPORT", {
    x: 40,
    y: height - 85,
    size: 10,
    font: boldFont,
    color: primaryColor,
  });

  // --- Details ---
  let currentY = height - 140;
  page.drawText(`Candidate ID: ${feedback.userId.slice(-8)}`, { x: 40, y: currentY, size: 12, font });
  page.drawText(`Role: ${interview.role}`, { x: 40, y: currentY - 20, size: 14, font: boldFont });
  page.drawText(`Date: ${new Date(feedback.createdAt).toLocaleDateString()}`, { x: width - 150, y: currentY, size: 10, font });

  // --- Overall Score ---
  currentY -= 80;
  page.drawRectangle({
    x: 40,
    y: currentY,
    width: 520,
    height: 50,
    color: primaryColor,
    opacity: 0.1,
  });
  page.drawText(`Overall Performance Score: ${feedback.totalScore}/100`, {
    x: 60,
    y: currentY + 18,
    size: 20,
    font: boldFont,
    color: darkColor,
  });

  // --- Summary ---
  currentY -= 40;
  page.drawText("Expert Assessment Summary", { x: 40, y: currentY, size: 16, font: boldFont });
  currentY -= 20;
  const summaryLines = feedback.finalAssessment.match(/.{1,101}/g) || [];
  summaryLines.forEach((line: string) => {
    page.drawText(line, { x: 40, y: currentY, size: 11, font, color: rgb(0.3, 0.3, 0.3) });
    currentY -= 15;
  });

  // --- Category Breakdown ---
  currentY -= 20;
  page.drawText("Category Breakdown", { x: 40, y: currentY, size: 16, font: boldFont });
  currentY -= 30;

  feedback.categoryScores.forEach((cat) => {
    page.drawText(cat.name, { x: 40, y: currentY, size: 11, font: boldFont });
    page.drawText(`${cat.score}%`, { x: width - 80, y: currentY, size: 11, font: boldFont, color: primaryColor });
    
    // Progress Bar
    page.drawRectangle({ x: 40, y: currentY - 10, width: 520, height: 4, color: rgb(0.9, 0.9, 0.9) });
    page.drawRectangle({ x: 40, y: currentY - 10, width: (cat.score / 100) * 520, height: 4, color: primaryColor });
    
    currentY -= 25;
    const commentLines = cat.comment.match(/.{1,110}/g) || [];
    commentLines.forEach((line: string) => {
        page.drawText(line, { x: 40, y: currentY, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
        currentY -= 12;
    });
    currentY -= 10;
    
    if (currentY < 100) { 
      page = pdfDoc.addPage([600, 850]); 
      currentY = 800; 
    }
  });

  // --- Strengths & Improvement ---
  currentY -= 20;
  page.drawText("Key Strengths", { x: 40, y: currentY, size: 14, font: boldFont, color: rgb(0.1, 0.5, 0.1) });
  currentY -= 20;
  feedback.strengths.forEach((s: string) => {
    page.drawText(`+ ${s}`, { x: 50, y: currentY, size: 10, font });
    currentY -= 15;
  });

  currentY -= 15;
  page.drawText("Critical Improvements", { x: 40, y: currentY, size: 14, font: boldFont, color: rgb(0.7, 0.1, 0.1) });
  currentY -= 20;
  feedback.areasForImprovement.forEach((a: string) => {
    page.drawText(`- ${a}`, { x: 50, y: currentY, size: 10, font });
    currentY -= 15;
  });

  // --- Footer ---
  page.drawText("© 2026 PrepWise AI. All rights reserved.", {
    x: width / 2 - 100,
    y: 30,
    size: 10,
    font,
    color: rgb(0.6, 0.6, 0.6),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString("base64");
}
