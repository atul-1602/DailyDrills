import { z } from "zod";

// Validates the incoming request to generate a quiz
export const GenerateQuizRequestSchema = z.object({
  grade: z.string().min(1, "Grade is required"),
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  difficulty: z.enum(["easy", "medium", "hard", "mixed"]).default("medium"),
  questionCount: z.number().min(3).max(20).default(10),
});

// The strict schema we force the AI to return
export const AIQuizResponseSchema = z.object({
  title: z.string().describe("A fun, engaging title for the quiz"),
  description: z.string().describe("A short, 1-2 sentence description of what the quiz covers"),
  questions: z.array(
    z.object({
      question: z.string().describe("The text of the question"),
      options: z
        .array(z.string())
        .length(4)
        .describe("Exactly 4 multiple choice options"),
      correctAnswer: z
        .number()
        .min(0)
        .max(3)
        .describe("The index (0-3) of the correct option in the options array"),
      explanation: z
        .string()
        .describe(
          "A short, educational explanation of why the answer is correct"
        ),
      difficulty: z
        .enum(["easy", "medium", "hard"])
        .describe("The difficulty level of this specific question"),
    })
  ).min(1),
});
