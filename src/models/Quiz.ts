import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface IQuiz extends Document {
  userId: string; // The creator (or system)
  title: string;
  description: string;
  grade: string;
  subject: string;
  topic: string;
  difficulty: string;
  questions: IQuestion[];
  questionCount: number;
  status: "CREATED" | "IN_PROGRESS" | "COMPLETED";
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: { type: [String], required: true, validate: (v: string[]) => v.length === 4 },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
});

const QuizSchema = new Schema<IQuiz>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    grade: { type: String, required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
    questionCount: { type: Number, required: true },
    status: { type: String, enum: ["CREATED", "IN_PROGRESS", "COMPLETED"], default: "CREATED" },
  },
  { timestamps: true }
);

export default mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);
