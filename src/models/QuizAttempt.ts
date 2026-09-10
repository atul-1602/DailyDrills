import mongoose, { Schema, Document } from "mongoose";

export interface IAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  points: number;
  answeredAt: Date;
}

export interface IQuizAttempt extends Document {
  quizId: mongoose.Types.ObjectId;
  userId: string;
  answers: IAnswer[];
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  bestStreak: number;
  startedAt: Date;
  completedAt?: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  questionId: { type: String, required: true },
  selectedOption: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  points: { type: Number, required: true, default: 0 },
  answeredAt: { type: Date, default: Date.now },
});

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true, index: true },
    userId: { type: String, required: true, index: true },
    answers: { type: [AnswerSchema], default: [] },
    score: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    incorrectAnswers: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema);
