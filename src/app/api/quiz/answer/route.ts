import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import connectToDatabase from "@/lib/db";
import Quiz from "@/models/Quiz";
import QuizAttempt, { IAnswer } from "@/models/QuizAttempt";

const AnswerRequestSchema = z.object({
  quizId: z.string(),
  attemptId: z.string(),
  questionIndex: z.number().min(0),
  selectedOption: z.number().min(0).max(3),
});

const XP_BY_DIFFICULTY: Record<string, number> = {
  easy: 50,
  medium: 100,
  hard: 150,
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = AnswerRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { quizId, attemptId, questionIndex, selectedOption } = validated.data;

    await connectToDatabase();

    // Fetch quiz to get the real correct answer
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const question = quiz.questions[questionIndex];
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const isCorrect = selectedOption === question.correctAnswer;
    const pointsEarned = isCorrect ? (XP_BY_DIFFICULTY[question.difficulty] ?? 100) : 0;

    // Update the QuizAttempt
    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    // Prevent re-answering the same question
    const alreadyAnswered = attempt.answers.some(
      (a: IAnswer) => a.questionId === questionIndex.toString()
    );

    if (!alreadyAnswered) {
      attempt.answers.push({
        questionId: questionIndex.toString(),
        selectedOption,
        isCorrect,
        points: pointsEarned,
        answeredAt: new Date(),
      });

      if (isCorrect) {
        attempt.correctAnswers += 1;
        attempt.score += pointsEarned;
      } else {
        attempt.incorrectAnswers += 1;
      }

      await attempt.save();
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      pointsEarned,
    });
  } catch (error: unknown) {
    console.error("Answer Submission Error:", error);
    return NextResponse.json({ error: "Failed to submit answer" }, { status: 500 });
  }
}
