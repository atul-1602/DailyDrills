"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────
interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  imageUrl: string;
  totalPoints: number;
  accuracy: number;
  quizzesPlayed: number;
  badgeEmoji: string;
}

// ─── Filter constants ──────────────────────────────────────
const GRADES = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12",
];

const SUBJECTS = [
  "Mathematics", "Science", "History", "Geography", "English", "Computer", "Finance", "Art",
];

type LeaderboardType = "global" | "grade" | "subject";

// ─── Rank Medal ────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return (
    <span className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-sm font-bold text-muted">
      {rank}
    </span>
  );
}

// ─── Skeleton ──────────────────────────────────────────────
function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-surface-2 rounded-xl ${className}`} />;
}

export default function Leaderboards() {
  const { user } = useUser();

  const [type, setType] = useState<LeaderboardType>("global");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ type, limit: "20" });
      if (type === "grade" && selectedGrade) params.set("grade", selectedGrade);
      if (type === "subject" && selectedSubject) params.set("subject", selectedSubject);

      const res = await fetch(`/api/leaderboard?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEntries(data.entries);
      } else {
        setError(data.error || "Failed to fetch leaderboard.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [type, selectedGrade, selectedSubject]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const myRank = user
    ? entries.findIndex((e) => e.userId === user.id) + 1
    : null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <Link href="/">
            <h1 className="text-2xl font-extrabold text-primary">DailyDrills</h1>
          </Link>
          <Link href="/dashboard">
            <button className="bg-surface border border-white/10 text-muted font-semibold px-4 py-2 rounded-full text-sm hover:border-primary/40 hover:text-foreground transition-colors">
              ← Dashboard
            </button>
          </Link>
        </header>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-extrabold mb-2">🏅 <span className="gradient-brand-text">Leaderboard</span></h2>
          <p className="text-muted">See how you rank against other learners</p>
        </motion.div>

        {/* My Rank Banner (if signed in and ranked) */}
        {myRank && myRank > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4 mb-6 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-muted font-medium">Your Current Rank</p>
              <p className="text-2xl font-extrabold text-primary">#{myRank}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted">Points</p>
              <p className="font-bold text-foreground">{entries[myRank - 1]?.totalPoints ?? 0}</p>
            </div>
          </motion.div>
        )}

        {/* Type Tabs */}
        <div className="flex gap-2 mb-4 bg-surface border border-white/10 rounded-2xl p-1.5 card-shadow">
          {(["global", "grade", "subject"] as LeaderboardType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 py-2 rounded-xl font-bold text-sm capitalize transition-colors ${
                type === t
                  ? "gradient-brand text-white shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {t === "global" ? "🌍 Global" : t === "grade" ? "🏫 By Grade" : "📚 By Subject"}
            </button>
          ))}
        </div>

        {/* Sub-filters */}
        <AnimatePresence>
          {type === "grade" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-4"
            >
              <div className="grid grid-cols-4 gap-2 bg-surface border border-white/10 rounded-2xl p-3 card-shadow">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrade(g)}
                    className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                      selectedGrade === g
                        ? "bg-primary text-white"
                        : "bg-surface-2 text-muted hover:text-foreground"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {type === "subject" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-4"
            >
              <div className="grid grid-cols-2 gap-2 bg-surface border border-white/10 rounded-2xl p-3 card-shadow">
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubject(s)}
                    className={`py-2 rounded-xl text-sm font-bold transition-colors ${
                      selectedSubject === s
                        ? "bg-primary text-white"
                        : "bg-surface-2 text-muted hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leaderboard Table */}
        <div className="bg-surface border border-white/10 rounded-3xl card-shadow overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-surface-2 border-b border-white/10 text-xs font-bold text-muted uppercase tracking-wide">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-2 text-center">Quizzes</div>
            <div className="col-span-2 text-center">Accuracy</div>
            <div className="col-span-2 text-right">Points</div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-10 text-center">
              <p className="text-muted mb-3">{error}</p>
              <button
                onClick={fetchLeaderboard}
                className="bg-primary text-white font-bold px-6 py-2 rounded-xl text-sm"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && entries.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-3xl mb-3">🏁</p>
              <p className="text-foreground font-medium">No rankings yet.</p>
              <p className="text-muted text-sm mt-1">Be the first to complete a quiz!</p>
              <Link href="/quiz/setup" className="inline-block mt-4">
                <button className="bg-primary text-white font-bold px-6 py-2 rounded-xl text-sm">
                  Start Playing
                </button>
              </Link>
            </div>
          )}

          {/* Entries */}
          {!loading && !error && entries.map((entry, index) => {
            const isMe = user?.id === entry.userId;
            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.2 }}
                className={`grid grid-cols-12 gap-2 items-center px-6 py-4 border-b border-white/5 last:border-0 transition-colors ${
                  isMe ? "bg-primary/5 border-l-4 border-l-primary" : "hover:bg-surface-2"
                }`}
              >
                {/* Rank */}
                <div className="col-span-1 flex items-center">
                  <RankBadge rank={entry.rank} />
                </div>

                {/* Player */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-lavender flex items-center justify-center text-base font-bold text-primary flex-shrink-0">
                    {entry.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${isMe ? "text-primary" : "text-foreground"}`}>
                      {entry.displayName}
                      {isMe && <span className="ml-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded-full">You</span>}
                    </p>
                  </div>
                </div>

                {/* Quizzes */}
                <div className="col-span-2 text-center text-sm font-semibold text-muted">
                  {entry.quizzesPlayed}
                </div>

                {/* Accuracy */}
                <div className="col-span-2 text-center text-sm font-semibold text-muted">
                  {entry.accuracy}%
                </div>

                {/* Points */}
                <div className="col-span-2 text-right">
                  <span className="font-extrabold text-foreground text-sm">{entry.totalPoints.toLocaleString()}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-6">
          <Link href="/quiz/setup">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="gradient-brand text-white font-bold py-3 px-8 rounded-2xl shadow-lg glow-shadow transition-shadow cursor-pointer"
            >
              Improve Your Rank
            </motion.button>
          </Link>
        </div>

      </div>
    </div>
  );
}
