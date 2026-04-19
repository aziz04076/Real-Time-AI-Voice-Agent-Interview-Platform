import { Schema, models, model, Document } from "mongoose";

export interface IAnswer {
  question: string;
  answer: string;
  score: number;
  strengths: string;
  weaknesses: string;
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
  feedback?: string;
  duration?: number; 
  techstack: string[];
  level: string;
  questions: string[];
  answers: IAnswer[]; // NEW Array of evaluated answers
  resumeSummary?: string; // NEW Caching the parsed resume
  finalized: boolean;
  createdAt: Date;
}

const AnswerSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  score: { type: Number, default: 0 },
  strengths: { type: String, default: "" },
  weaknesses: { type: String, default: "" },
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
  feedback: { type: String, default: "" }, // Legacy
  overallFeedback: { type: String, default: "" }, // NEW: Consolidated
  strengths: { type: String, default: "" }, // NEW: Consolidated
  weaknesses: { type: String, default: "" }, // NEW: Consolidated
  areasToImprove: { type: String, default: "" }, // NEW: Consolidated
  duration: { type: Number, default: 0 },
  techstack: { type: [String], default: [] },
  level: { type: String, default: "All Levels" },
  questions: { type: [String], default: [] },
  answers: { type: [AnswerSchema], default: [] }, // NEW: Now allows raw q/a during session
  resumeSummary: { type: String, default: "" }, // NEW
  finalized: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Interview = models?.Interview || model("Interview", InterviewSchema);

export default Interview;
