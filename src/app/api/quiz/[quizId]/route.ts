import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import Quiz, { IQuestion } from "@/models/Quiz";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quizId } = await params;

    await connectToDatabase();

    const quiz = await Quiz.findById(quizId).lean();

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Return questions without leaking correct answers to the client
    const safeQuestions = quiz.questions.map((q: IQuestion, index: number) => ({
      id: index.toString(),
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
    }));

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz._id.toString(),
        title: quiz.title,
        description: quiz.description,
        grade: quiz.grade,
        subject: quiz.subject,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        questionCount: quiz.questionCount,
        questions: safeQuestions,
      },
    });
  } catch (error: unknown) {
    console.error("Quiz Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}
