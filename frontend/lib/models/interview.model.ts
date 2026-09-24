import { Schema, models, model, Document } from "mongoose";

export interface IAnswer {
  question: string;
  answer: string;
  score: number;
  technicalCorrectness: string;
  strengths: string;
  weaknesses: string;
  missingPoints: string;
  improvementSuggestions: string;
  betterAnswer: string;
}

export interface IInterview extends Document {
  id: string; 
  userId: string;
  role: string; // Legacy/Alias for jobRole
  jobRole: string; // NEW
  type: string; // Legacy/Alias for field
  field: string; // NEW
  interviewType?: string; 
  score?: number;
  communicationScore?: number;
  technicalScore?: number;
  problemSolvingScore?: number;
  confidenceScore?: number;
  hiringRecommendation?: string;
  recommendedTopics?: string[];
  feedback?: string;
  duration?: number; 
  totalQuestions?: number;
  techstack: string[];
  level: string;
  questions: string[];
  answers: IAnswer[]; // Array of evaluated answers
  resumeSummary?: string; // Caching the parsed resume
  finalized: boolean;
  createdAt: Date;
}

const AnswerSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  score: { type: Number, default: 0 },
  technicalCorrectness: { type: String, default: "" },
  strengths: { type: String, default: "" },
  weaknesses: { type: String, default: "" },
  missingPoints: { type: String, default: "" },
  improvementSuggestions: { type: String, default: "" },
  betterAnswer: { type: String, default: "" }
});

const InterviewSchema = new Schema({
  userId: { type: String, required: true },
  role: { type: String, required: true }, // Legacy
  jobRole: { type: String, default: "" }, // NEW
  type: { type: String, required: true }, // Legacy
  field: { type: String, default: "" }, // NEW
  interviewType: { type: String, enum: ["technical", "hr", "coding", "generate", "interview"], default: "technical" },
  score: { type: Number, default: 0 }, // Final consolidated score
  communicationScore: { type: Number, default: 0 },
  technicalScore: { type: Number, default: 0 },
  problemSolvingScore: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 0 },
  hiringRecommendation: { type: String, default: "" },
  recommendedTopics: { type: [String], default: [] },
  feedback: { type: String, default: "" }, // Legacy
  overallFeedback: { type: String, default: "" }, // Consolidated
  strengths: { type: String, default: "" }, // Consolidated
  weaknesses: { type: String, default: "" }, // Consolidated
  areasToImprove: { type: String, default: "" }, // Consolidated
  duration: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  techstack: { type: [String], default: [] },
  level: { type: String, default: "All Levels" },
  questions: { type: [String], default: [] },
  answers: { type: [AnswerSchema], default: [] },
  resumeSummary: { type: String, default: "" },
  finalized: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Interview = models?.Interview || model("Interview", InterviewSchema);

export default Interview;

