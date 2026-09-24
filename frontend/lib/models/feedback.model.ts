import { Schema, models, model, Document } from "mongoose";

export interface IFeedback extends Document {
  interviewId: string;
  userId: string;
  totalScore: number;
  categoryScores: {
    name: string;
    score: number;
    comment: string;
  }[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema({
  interviewId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  totalScore: { type: Number, required: true },
  categoryScores: [
    {
      name: { type: String, required: true },
      score: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
  strengths: { type: [String], default: [] },
  areasForImprovement: { type: [String], default: [] },
  finalAssessment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Feedback = models?.Feedback || model("Feedback", FeedbackSchema);

export default Feedback;
