import mongoose, { Schema, Document } from "mongoose";

export interface IUserStats extends Document {
  userId: string;
  displayName: string;
  imageUrl: string;
  totalXP: number;
  totalPoints: number;
  quizzesPlayed: number;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  currentStreak: number;
  bestStreak: number;
  // Grade-specific points map e.g. { "Grade 5": 500, "Grade 8": 300 }
  gradePoints: Map<string, number>;
  // Subject-specific points map e.g. { "Math": 400, "Science": 200 }
  subjectPoints: Map<string, number>;
  updatedAt: Date;
}

const UserStatsSchema = new Schema<IUserStats>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, default: "Anonymous Scholar" },
    imageUrl: { type: String, default: "" },
    totalXP: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    quizzesPlayed: { type: Number, default: 0 },
    questionsAnswered: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    gradePoints: { type: Map, of: Number, default: {} },
    subjectPoints: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.UserStats ||
  mongoose.model<IUserStats>("UserStats", UserStatsSchema);
