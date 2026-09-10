import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import connectToDatabase from "@/lib/db";
import Quiz from "@/models/Quiz";
import QuizAttempt from "@/models/QuizAttempt";
import UserStats from "@/models/UserStats";

const CompleteRequestSchema = z.object({
  quizId: z.string(),
  attemptId: z.string(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = CompleteRequestSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { quizId, attemptId } = validated.data;

    await connectToDatabase();

    const [quiz, attempt, clerkUser] = await Promise.all([
      Quiz.findById(quizId),
      QuizAttempt.findById(attemptId),
      currentUser(),
    ]);

    if (!quiz || !attempt) {
      return NextResponse.json({ error: "Quiz or attempt not found" }, { status: 404 });
    }

    // Finalize the attempt
    const totalQuestions = quiz.questions.length;
    const correctAnswers = attempt.correctAnswers;
    const accuracy = totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

    // Calculate best streak
    let currentStreak = 0;
    let bestStreak = 0;
    for (const answer of attempt.answers) {
      if (answer.isCorrect) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    attempt.accuracy = accuracy;
    attempt.bestStreak = bestStreak;
    attempt.incorrectAnswers = totalQuestions - correctAnswers;
    attempt.completedAt = new Date();
    await attempt.save();

    // Mark quiz as COMPLETED
    quiz.status = "COMPLETED";
    await quiz.save();

    // Upsert UserStats
    const displayName =
      clerkUser?.fullName ||
      clerkUser?.username ||
      clerkUser?.emailAddresses?.[0]?.emailAddress ||
      "Anonymous Scholar";
    const imageUrl = clerkUser?.imageUrl || "";

    const existingStats = await UserStats.findOne({ userId });

    // Streak logic: increment if last quiz was today or yesterday
    let newCurrentStreak = 1;
    let newBestStreak = bestStreak;

    if (existingStats) {
      const lastUpdated = existingStats.updatedAt;
      const now = new Date();
      const diffMs = now.getTime() - new Date(lastUpdated).getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        newCurrentStreak = existingStats.currentStreak + 1;
      } else {
        newCurrentStreak = 1; // streak broken
      }
      newBestStreak = Math.max(existingStats.bestStreak, bestStreak, newCurrentStreak);
    }

    // Update grade/subject point maps
    const gradePointsKey = quiz.grade;
    const subjectPointsKey = quiz.subject;
    const earnedScore = attempt.score;

    const priorStats = await UserStats.findOne({ userId });
    const totalCorrect = (priorStats?.correctAnswers ?? 0) + correctAnswers;
    const totalAnswered = (priorStats?.questionsAnswered ?? 0) + totalQuestions;
    const newAccuracy =
      totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const newGradePoints =
      (priorStats?.gradePoints?.get(gradePointsKey) ?? 0) + earnedScore;
    const newSubjectPoints =
      (priorStats?.subjectPoints?.get(subjectPointsKey) ?? 0) + earnedScore;

    await UserStats.findOneAndUpdate(
      { userId },
      {
        $set: {
          displayName,
          imageUrl,
          currentStreak: newCurrentStreak,
          bestStreak: newBestStreak,
          accuracy: newAccuracy,
          [`gradePoints.${gradePointsKey}`]: newGradePoints,
          [`subjectPoints.${subjectPointsKey}`]: newSubjectPoints,
        },
        $inc: {
          totalXP: earnedScore,
          totalPoints: earnedScore,
          quizzesPlayed: 1,
          questionsAnswered: totalQuestions,
          correctAnswers: correctAnswers,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Quiz completed!",
      result: {
        score: attempt.score,
        correctAnswers,
        incorrectAnswers: attempt.incorrectAnswers,
        totalQuestions,
        accuracy,
        bestStreak,
        xpEarned: earnedScore,
        quizTitle: quiz.title,
        subject: quiz.subject,
        grade: quiz.grade,
        topic: quiz.topic,
        difficulty: quiz.difficulty,
      },
    });
  } catch (error: unknown) {
    console.error("Quiz Completion Error:", error);
    return NextResponse.json({ error: "Failed to complete quiz" }, { status: 500 });
  }
}
