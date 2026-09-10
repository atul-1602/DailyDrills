import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import UserStats from "@/models/UserStats";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const stats = await UserStats.findOne({ userId }).lean();

    if (!stats) {
      // Return zero stats for new users
      return NextResponse.json({
        success: true,
        stats: {
          totalXP: 0,
          totalPoints: 0,
          quizzesPlayed: 0,
          questionsAnswered: 0,
          correctAnswers: 0,
          accuracy: 0,
          currentStreak: 0,
          bestStreak: 0,
          gradePoints: {},
          subjectPoints: {},
        },
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalXP: stats.totalXP,
        totalPoints: stats.totalPoints,
        quizzesPlayed: stats.quizzesPlayed,
        questionsAnswered: stats.questionsAnswered,
        correctAnswers: stats.correctAnswers,
        accuracy: stats.accuracy,
        currentStreak: stats.currentStreak,
        bestStreak: stats.bestStreak,
        gradePoints: Object.fromEntries(stats.gradePoints ?? new Map()),
        subjectPoints: Object.fromEntries(stats.subjectPoints ?? new Map()),
      },
    });
  } catch (error: unknown) {
    console.error("User Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
