import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { GenerateQuizRequestSchema, AIQuizResponseSchema } from "@/lib/validation";
import connectToDatabase from "@/lib/db";
import Quiz from "@/models/Quiz";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = GenerateQuizRequestSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: validatedData.error.issues },
        { status: 400 }
      );
    }

    const { grade, subject, topic, difficulty, questionCount } = validatedData.data;

    const systemPrompt = `You are an expert EdTech tutor creating a quiz for a ${grade} student studying ${subject}.
Topic: ${topic}.
Target Difficulty: ${difficulty}.
Total Questions: ${questionCount}.
Rules:
- Questions must be age-appropriate and educational.
- Provide exactly 4 options per question.
- Do not repeat questions or options.
- Options must be plausible but only one can be entirely correct.
- The correctAnswer field must be the 0-based index (0, 1, 2, or 3) of the correct option in the options array.
- Provide a helpful, encouraging explanation for the correct answer.
- Assign a difficulty of "easy", "medium", or "hard" to each question individually.`;

    const { object: aiQuiz } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: AIQuizResponseSchema,
      prompt: systemPrompt,
    });

    // Save to MongoDB
    await connectToDatabase();

    const quiz = await Quiz.create({
      userId,
      title: aiQuiz.title,
      description: aiQuiz.description,
      grade,
      subject,
      topic,
      difficulty,
      questions: aiQuiz.questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
      })),
      questionCount: aiQuiz.questions.length,
      status: "CREATED",
    });

    return NextResponse.json({
      success: true,
      message: "Quiz generated successfully",
      quizId: quiz._id.toString(),
      title: aiQuiz.title,
    });
  } catch (error: unknown) {
    console.error("Quiz Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
}
