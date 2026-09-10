import { NextResponse } from "next/server";
import { z } from "zod";
import connectToDatabase from "@/lib/db";
import UserStats from "@/models/UserStats";
import type { PipelineStage } from "mongoose";

const QuerySchema = z.object({
  type: z.enum(["global", "grade", "subject"]).default("global"),
  grade: z.string().optional(),
  subject: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
});

const RANK_BADGES = ["🥇", "🥈", "🥉"];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsedParams = QuerySchema.safeParse({
      type: searchParams.get("type") ?? "global",
      grade: searchParams.get("grade") ?? undefined,
      subject: searchParams.get("subject") ?? undefined,
      limit: searchParams.get("limit") ?? "10",
    });

    if (!parsedParams.success) {
      return NextResponse.json({ error: "Invalid query params" }, { status: 400 });
    }

    await connectToDatabase();

    const { type, grade, subject, limit } = parsedParams.data;

    let pipeline: PipelineStage[];

    if (type === "grade" && grade) {
      pipeline = [
        {
          $addFields: {
            filterPoints: { $ifNull: [`$gradePoints.${grade}`, 0] },
          },
        },
        { $match: { filterPoints: { $gt: 0 } } },
        { $sort: { filterPoints: -1 as const } },
        { $limit: limit },
        {
          $project: {
            userId: 1,
            displayName: 1,
            imageUrl: 1,
            totalPoints: "$filterPoints",
            accuracy: 1,
            quizzesPlayed: 1,
          },
        },
      ];
    } else if (type === "subject" && subject) {
      pipeline = [
        {
          $addFields: {
            filterPoints: { $ifNull: [`$subjectPoints.${subject}`, 0] },
          },
        },
        { $match: { filterPoints: { $gt: 0 } } },
        { $sort: { filterPoints: -1 as const } },
        { $limit: limit },
        {
          $project: {
            userId: 1,
            displayName: 1,
            imageUrl: 1,
            totalPoints: "$filterPoints",
            accuracy: 1,
            quizzesPlayed: 1,
          },
        },
      ];
    } else {
      // Global leaderboard
      pipeline = [
        { $match: { totalPoints: { $gt: 0 } } },
        { $sort: { totalPoints: -1 as const } },
        { $limit: limit },
        {
          $project: {
            userId: 1,
            displayName: 1,
            imageUrl: 1,
            totalPoints: 1,
            accuracy: 1,
            quizzesPlayed: 1,
          },
        },
      ];
    }

    const results = await UserStats.aggregate(pipeline);

    const entries = results.map((user, index) => ({
      rank: index + 1,
      userId: user.userId,
      displayName: user.displayName || "Anonymous Scholar",
      imageUrl: user.imageUrl || "",
      totalPoints: user.totalPoints ?? 0,
      accuracy: user.accuracy ?? 0,
      quizzesPlayed: user.quizzesPlayed ?? 0,
      badgeEmoji: RANK_BADGES[index] ?? `${index + 1}`,
    }));

    return NextResponse.json({
      success: true,
      type,
      grade: grade ?? null,
      subject: subject ?? null,
      entries,
    });
  } catch (error: unknown) {
    console.error("Leaderboard Error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
