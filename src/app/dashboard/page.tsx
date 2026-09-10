"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────
interface UserStats {
  totalXP: number;
  totalPoints: number;
  quizzesPlayed: number;
  questionsAnswered: number;
  accuracy: number;
  currentStreak: number;
  bestStreak: number;
}

interface HistoryItem {
  attemptId: string;
  quizId: string;
  title: string;
  subject: string;
  grade: string;
  topic: string;
  difficulty: string;
  score: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
}

// ─── Count-up hook ───────────────────────────────────────────
function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const from = 0;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

// ─── Stat Card ─────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  tint,
}: {
  icon: string;
  label: string;
  value: string | number;
  tint: string;
}) {
  const numericMatch = typeof value === "number" ? value : parseInt(String(value), 10);
  const isNumeric = !Number.isNaN(numericMatch);
  const suffix = typeof value === "string" ? value.replace(/^-?\d+/, "") : "";
  const animated = useCountUp(isNumeric ? numericMatch : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-surface border border-white/10 rounded-3xl p-6 card-shadow flex flex-col items-center text-center"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 ${tint}`}>
        {icon}
      </div>
      <p className="text-3xl font-extrabold text-foreground">
        {isNumeric ? `${animated}${suffix}` : value}
      </p>
      <p className="text-sm font-semibold text-muted mt-1">{label}</p>
    </motion.div>
  );
}

// ─── Difficulty Badge ───────────────────────────────────────
const DIFF_COLORS: Record<string, string> = {
  easy: "bg-mint text-emerald-300",
  medium: "bg-peach text-amber-300",
  hard: "bg-secondary/15 text-rose-300",
  mixed: "bg-lavender text-indigo-300",
};

// ─── Skeleton ──────────────────────────────────────────────
function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-surface-2 rounded-xl ${className}`} />;
}

export default function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetch("/api/user/stats")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.stats); })
      .catch(console.error)
      .finally(() => setLoadingStats(false));

    fetch("/api/user/history")
      .then((r) => r.json())
      .then((d) => { if (d.success) setHistory(d.history); })
      .catch(console.error)
      .finally(() => setLoadingHistory(false));
  }, []);

  const firstName = user?.firstName || "Scholar";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <Link href="/">
            <h1 className="text-2xl font-extrabold text-primary">DailyDrills</h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/leaderboards">
              <button className="bg-surface border border-white/10 text-muted font-semibold px-4 py-2 rounded-full text-sm hover:border-primary/40 hover:text-foreground transition-colors">
                🏅 Leaderboard
              </button>
            </Link>
            <UserButton />
          </div>
        </header>

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden bg-surface rounded-3xl p-8 card-shadow border border-white/10 mb-6"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="relative text-3xl font-bold text-foreground mb-1">
            Welcome back, {firstName}
          </h2>
          <p className="relative text-muted mb-6">Ready to learn something new today?</p>
          <Link href="/quiz/setup" className="relative inline-block">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="gradient-brand text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg glow-shadow transition-shadow cursor-pointer"
            >
              Start New Quiz
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {loadingStats ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-3xl" />
            ))
          ) : (
            <>
              <StatCard icon="🔥" label="Current Streak" value={`${stats?.currentStreak ?? 0} Days`} tint="bg-peach" />
              <StatCard icon="⭐" label="Total XP" value={stats?.totalXP ?? 0} tint="bg-lavender" />
              <StatCard icon="🎯" label="Accuracy" value={`${stats?.accuracy ?? 0}%`} tint="bg-mint" />
              <StatCard icon="📚" label="Quizzes Played" value={stats?.quizzesPlayed ?? 0} tint="bg-sky" />
            </>
          )}
        </div>

        {/* Extra stats row */}
        {!loadingStats && stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-surface rounded-2xl p-5 card-shadow border border-white/10 text-center">
              <p className="text-2xl font-extrabold text-foreground">{stats.questionsAnswered}</p>
              <p className="text-sm text-muted font-medium mt-1">Questions Answered</p>
            </div>
            <div className="bg-surface rounded-2xl p-5 card-shadow border border-white/10 text-center">
              <p className="text-2xl font-extrabold text-foreground">{stats.bestStreak}</p>
              <p className="text-sm text-muted font-medium mt-1">Best Streak</p>
            </div>
            <div className="bg-surface rounded-2xl p-5 card-shadow border border-white/10 text-center">
              <p className="text-2xl font-extrabold text-foreground">{stats.totalPoints}</p>
              <p className="text-sm text-muted font-medium mt-1">Total Points</p>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-surface rounded-3xl p-6 card-shadow border border-white/10">
          <h3 className="text-xl font-bold text-foreground mb-4">Recent Activity</h3>

          {loadingHistory ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted bg-surface-2 rounded-xl border border-dashed border-white/10">
              <p className="text-2xl mb-2">🚀</p>
              <p className="font-medium">Your learning journey starts here!</p>
              <Link href="/quiz/setup" className="text-primary font-semibold text-sm mt-2 hover:underline">
                Start your first quiz →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, i) => (
                <motion.div
                  key={item.attemptId}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.2 }}
                  className="flex items-center justify-between p-4 bg-surface-2 rounded-2xl hover:bg-surface-2/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center card-shadow text-lg flex-shrink-0">
                      {item.subject === "Mathematics" ? "📐" :
                       item.subject === "Science" ? "🔬" :
                       item.subject === "History" ? "🏛️" :
                       item.subject === "Geography" ? "🌍" :
                       item.subject === "English" ? "📖" :
                       item.subject === "Computer" ? "💻" :
                       item.subject === "Finance" ? "💰" :
                       item.subject === "Art" ? "🎨" : "📚"}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm leading-snug">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${DIFF_COLORS[item.difficulty] ?? "bg-surface text-muted"}`}>
                          {item.difficulty}
                        </span>
                        <span className="text-xs text-muted">{item.grade}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-extrabold text-foreground">{item.accuracy}%</p>
                    <p className="text-xs text-muted">{item.correctAnswers}/{item.totalQuestions} correct</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
