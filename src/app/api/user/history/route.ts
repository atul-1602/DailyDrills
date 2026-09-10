import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import QuizAttempt from "@/models/QuizAttempt";
import Quiz from "@/models/Quiz";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const attempts = await QuizAttempt.find({ userId, completedAt: { $exists: true } })
      .sort({ completedAt: -1 })
      .limit(5)
      .lean();

    const history = await Promise.all(
      attempts.map(async (attempt) => {
        const quiz = await Quiz.findById(attempt.quizId).select("title subject grade topic difficulty").lean();
        return {
          attemptId: attempt._id.toString(),
          quizId: attempt.quizId.toString(),
          title: quiz?.title ?? "Unknown Quiz",
          subject: quiz?.subject ?? "",
          grade: quiz?.grade ?? "",
          topic: quiz?.topic ?? "",
          difficulty: quiz?.difficulty ?? "",
          score: attempt.score,
          accuracy: attempt.accuracy,
          correctAnswers: attempt.correctAnswers,
          totalQuestions: attempt.answers.length,
          completedAt: attempt.completedAt,
        };
      })
    );

    return NextResponse.json({ success: true, history });
  } catch (error: unknown) {
    console.error("User History Error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}
