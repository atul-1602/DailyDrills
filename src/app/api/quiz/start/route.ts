import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import connectToDatabase from "@/lib/db";
import Quiz from "@/models/Quiz";
import QuizAttempt from "@/models/QuizAttempt";

const StartRequestSchema = z.object({
  quizId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = StartRequestSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { quizId } = validated.data;

    await connectToDatabase();

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Create a fresh attempt
    const attempt = await QuizAttempt.create({
      quizId: quiz._id,
      userId,
      answers: [],
      score: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      accuracy: 0,
      bestStreak: 0,
      startedAt: new Date(),
    });

    // Mark quiz as IN_PROGRESS
    quiz.status = "IN_PROGRESS";
    await quiz.save();

    return NextResponse.json({
      success: true,
      attemptId: attempt._id.toString(),
    });
  } catch (error: unknown) {
    console.error("Quiz Start Error:", error);
    return NextResponse.json({ error: "Failed to start quiz" }, { status: 500 });
  }
}
