export const FALLBACK_QUESTIONS: Record<string, string[]> = {
  "B.Tech": [
    "Explain the difference between a process and a thread in operating systems.",
    "What is the significance of Big O notation in algorithm analysis?",
    "Describe the 4 pillars of Object-Oriented Programming (OOP).",
    "How does a load balancer improve the scalability of a system?",
    "What is the role of a compiler versus an interpreter?",
    "Explain the concept of 'idempotency' in the context of REST APIs.",
    "How do you handle deadlocks in a multi-threaded application?",
    "What are the advantages of using Microservices over a Monolithic architecture?"
  ],
  "Pharmacy": [
    "What are the essential steps in the drug development process?",
    "Explain the concept of 'Bioavailability' and factors that affect it.",
    "How do you ensure compliance with 'Good Manufacturing Practices' (GMP)?",
    "What is the role of a pharmacist in preventing medication errors?",
    "Describe the mechanism of action for common classes of antibiotics.",
    "How do you handle a situation where a prescribed drug has a potential interaction?",
    "What is the importance of 'Pharmacovigilance' in the pharmaceutical industry?",
    "Explain the difference between a generic drug and a brand-name drug."
  ],
  "Medical": [
    "Describe the protocol for handling a medical emergency in a clinical setting.",
    "What are the key components of a comprehensive patient history?",
    "Explain the importance of 'Informed Consent' in medical procedures.",
    "How do you maintain patient confidentiality under HIPAA regulations?",
    "Describe the diagnostic approach for a patient presenting with acute chest pain.",
    "What is the role of interdisciplinary teams in modern healthcare?",
    "How do you stay updated with the latest clinical guidelines and research?",
    "Explain the concept of 'Evidence-Based Medicine' (EBM)."
  ],
  "Commerce": [
    "What is the difference between 'Capital Expenditure' and 'Revenue Expenditure'?",
    "Explain the 'Double Entry System' of accounting.",
    "How do 'Current Assets' differ from 'Fixed Assets' on a balance sheet?",
    "What is the impact of inflation on a company's financial statements?",
    "Describe the process of a corporate audit and its significance.",
    "What are the key indicators used in financial ratio analysis?",
    "How does 'Working Capital' management affect a business's liquidity?",
    "Explain the concept of 'Time Value of Money' (TVM)."
  ],
  "Management": [
    "Describe your approach to managing a team with conflicting personalities.",
    "How do you handle a project that is falling behind schedule?",
    "What is the difference between 'Transactional' and 'Transformational' leadership?",
    "How do you define and measure the success of a business strategy?",
    "Describe a time you had to make an unpopular decision for the good of the company.",
    "What is your process for delegating tasks effectively within a team?",
    "How do you foster a culture of innovation and continuous improvement?",
    "Explain the importance of 'Stakeholder Management' in large-scale projects."
  ],
  "Arts": [
    "How do you approach the creative process when starting a new project?",
    "Describe the role of 'Visual Hierarchy' in graphic design.",
    "How do you handle constructive criticism on your creative work?",
    "What is the significance of 'User Experience' (UX) in digital art and design?",
    "Describe your experience with different creative software and tools.",
    "How do you stay inspired and keep your creative skills sharp?",
    "What is the importance of 'Brand Identity' in modern marketing?",
    "Explain the concept of 'Color Theory' and its application in your work."
  ],
  "General": [
    "Tell me about a challenging technical problem you solved recently.",
    "How do you stay up-to-date with the latest technologies in your field?",
    "Describe your experience working in an Agile/Scrum environment.",
    "How do you handle conflicting priorities when working on multiple tasks?",
    "What is your approach to debugging a complex issue in production?",
    "Why are you interested in this position?",
    "Where do you see yourself in five years?",
    "What are your greatest strengths and weaknesses?"
  ]
};

export const COMPANY_QUESTIONS: Record<string, string[]> = {
  "Google": [
    "How would you optimize a search algorithm for a multi-petabyte dataset?",
    "Explain how you would handle a sudden 10x spike in traffic to a latency-sensitive service.",
    "Describe your approach to designing a truly global-scale distributed database.",
    "What are the trade-offs between consistency and availability in a massive system?"
  ],
  "Amazon": [
    "Tell me about a time you had to 'Earn Trust' after a major project failure.",
    "Describe a situation where you had to 'Dive Deep' into a complex data issue.",
    "How do you handle a scenario where you have to 'Deliver Results' under extreme pressure?",
    "Give an example of when you showed 'Ownership' over a problem that wasn't strictly your responsibility."
  ],
  "Microsoft": [
    "How would you integrate AI features into a legacy productivity suite like Office?",
    "Describe your experience with multi-tenant cloud architectures (Azure focus).",
    "What is your approach to ensuring backward compatibility in shared library updates?",
    "How do you balance innovation with system stability in a globally used OS?"
  ],
  "McKinsey": [
    "How would you structure an approach to enter a new market for a Fortune 500 company?",
    "What are the most critical KPIs for a retail giant transitioning to an e-commerce model?",
    "Walk me through a case where you had to synthesize complex data into a board-level recommendation.",
    "How do you handle a situation where a client's data contradicts their intuitive strategy?"
  ],
  "Pfizer": [
    "Explain the importance of clinical trial phases and their respective goals.",
    "How do you ensure data integrity in a highly regulated pharmaceutical environment?",
    "Describe the key challenges in the global distribution of temperature-sensitive medications.",
    "How do you approach the ethical considerations in breakthrough vaccine development?"
  ],
  "Deloitte": [
    "How do you approach a transformation project for a client with strong internal resistance?",
    "Describe a time you had to manage client expectations during a scope creep situation.",
    "What is your strategy for delivering value in a fixed-fee consulting engagement?",
    "How do you ensure a successful knowledge transfer after a project concludes?"
  ]
};

export function getFallbackQuestion(role: string = "General", field: string = "General", company: string = ""): string {
  const normalizedField = field?.toLowerCase() || "general";
  const normalizedRole = role?.toLowerCase() || "general";
  const normalizedCompany = company?.toLowerCase() || "";

  // 1. High Priority: Company-specific signature questions
  if (normalizedCompany) {
    for (const [key, questions] of Object.entries(COMPANY_QUESTIONS)) {
      if (normalizedCompany.includes(key.toLowerCase())) {
        return questions[Math.floor(Math.random() * questions.length)];
      }
    }
  }

  let finalCategory = "General";

  // 2. Medium Priority: Field/Branch matching
  if (normalizedField.includes("tech") || normalizedField.includes("eng") || normalizedField.includes("comp") || normalizedField.includes("b.tech")) {
    finalCategory = "B.Tech";
  } else if (normalizedField.includes("pharm")) {
    finalCategory = "Pharmacy";
  } else if (normalizedField.includes("med") || normalizedField.includes("doctor") || normalizedField.includes("health")) {
    finalCategory = "Medical";
  } else if (normalizedField.includes("comm") || normalizedField.includes("fin") || normalizedField.includes("acc")) {
    finalCategory = "Commerce";
  } else if (normalizedField.includes("manag") || normalizedField.includes("lead") || normalizedField.includes("biz")) {
    finalCategory = "Management";
  } else if (normalizedField.includes("art") || normalizedField.includes("design") || normalizedField.includes("creat")) {
    finalCategory = "Arts";
  }

  // 3. Low Priority: Role-based inference
  if (finalCategory === "General") {
    if (normalizedRole.includes("dev") || normalizedRole.includes("engineer")) finalCategory = "B.Tech";
    else if (normalizedRole.includes("pharmacist")) finalCategory = "Pharmacy";
    else if (normalizedRole.includes("bank") || normalizedRole.includes("analyst")) finalCategory = "Commerce";
    else if (normalizedRole.includes("manager")) finalCategory = "Management";
  }

  const questions = FALLBACK_QUESTIONS[finalCategory] || FALLBACK_QUESTIONS.General;
  return questions[Math.floor(Math.random() * questions.length)];
}
