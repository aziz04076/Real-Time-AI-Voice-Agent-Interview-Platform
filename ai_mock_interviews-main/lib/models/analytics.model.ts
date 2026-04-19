import { Schema, models, model, Document } from "mongoose";

export interface IAnalytics extends Document {
  date: Date;
  newUsers: number;
  totalInterviews: number;
  averageScore: number;
  mostCommonType: string;
}

const AnalyticsSchema = new Schema({
  date: { type: Date, required: true, unique: true },
  newUsers: { type: Number, default: 0 },
  totalInterviews: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  mostCommonType: { type: String, default: "technical" },
});

const Analytics = models?.Analytics || model("Analytics", AnalyticsSchema);

export default Analytics;
