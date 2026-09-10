"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

interface QuizResult {
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  accuracy: number;
  bestStreak: number;
  xpEarned: number;
  quizTitle: string;
  subject: string;
  grade: string;
  topic: string;
  difficulty: string;
}

const PERF_TIERS = [
  { min: 90, emoji: "🏆", label: "Outstanding!", color: "from-amber-400 to-orange-400", text: "text-amber-300" },
  { min: 70, emoji: "🎯", label: "Great Job!", color: "from-indigo-400 to-violet-400", text: "text-indigo-300" },
  { min: 50, emoji: "👍", label: "Good Work!", color: "from-emerald-400 to-teal-400", text: "text-emerald-300" },
  { min: 0, emoji: "💪", label: "Keep Going!", color: "from-rose-400 to-pink-400", text: "text-rose-300" },
];

function getTier(accuracy: number) {
  return PERF_TIERS.find((t) => accuracy >= t.min) ?? PERF_TIERS[PERF_TIERS.length - 1];
}

function StatCard({ icon, label, value, delay = 0 }: { icon: string; label: string; value: string | number; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      whileHover={{ y: -2 }}
      className="bg-surface-2 rounded-2xl p-4 text-center border border-white/5"
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xl font-extrabold text-foreground">{value}</div>
      <div className="text-xs text-muted font-medium mt-0.5">{label}</div>
    </motion.div>
  );
}

export default function QuizResult() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const quizId = params.quizId as string;
  const attemptId = searchParams.get("attemptId");

  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!attemptId) {
      setError("No attempt ID provided.");
      setLoading(false);
      return;
    }

    async function fetchResult() {
      try {
        const res = await fetch("/api/quiz/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizId, attemptId }),
        });
        const data = await res.json();
        if (data.success) {
          setResult(data.result);
        } else {
          setError(data.error || "Failed to load results.");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [quizId, attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent"
        />
        <p className="text-muted font-semibold text-lg">Calculating your score…</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-4">
        <div className="bg-surface border border-white/10 rounded-3xl p-10 card-shadow text-center max-w-md w-full">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Results Unavailable</h2>
          <p className="text-muted mb-6">{error ?? "Could not load results."}</p>
          <Link href="/dashboard">
            <button className="bg-primary text-white font-bold py-3 px-8 rounded-2xl hover:bg-primary/90 transition-colors">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const tier = getTier(result.accuracy);
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference * (1 - result.accuracy / 100);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-surface border border-white/10 rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Trophy */}
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 320, damping: 20 }}
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center text-4xl shadow-lg`}
          >
            {tier.emoji}
          </motion.div>
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-extrabold text-center mb-1 ${tier.text}`}>
          {tier.label}
        </h1>
        <p className="text-muted text-center text-sm mb-6 font-medium">
          {result.quizTitle}
        </p>

        {/* Score Circle */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 96 96" className="w-32 h-32 -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-2" />
              <motion.circle
                cx="48" cy="48" r="40"
                stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className={result.accuracy >= 70 ? "text-accent" : result.accuracy >= 50 ? "text-amber-400" : "text-secondary"}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-foreground">{result.accuracy}%</span>
              <span className="text-xs text-muted font-medium">accuracy</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard icon="⭐" label="XP Earned" value={`+${result.xpEarned}`} delay={0.35} />
          <StatCard icon="✅" label="Correct" value={`${result.correctAnswers}/${result.totalQuestions}`} delay={0.4} />
          <StatCard icon="🔥" label="Best Streak" value={result.bestStreak} delay={0.45} />
          <StatCard icon="📊" label="Score" value={result.score} delay={0.5} />
        </div>

        {/* Quiz Meta Tags */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {[result.subject, result.grade, result.difficulty].map((tag) => (
            <span key={tag} className="bg-lavender text-primary text-xs font-bold px-3 py-1 rounded-full capitalize">
              {tag}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onClick={() => router.push("/quiz/setup")}
            className="w-full gradient-brand text-white font-bold py-4 rounded-2xl text-lg shadow-lg glow-shadow transition-shadow cursor-pointer"
          >
            Play Again 🚀
          </motion.button>
          <Link href="/dashboard" className="w-full">
            <button className="w-full bg-surface-2 border-2 border-white/10 text-muted font-bold py-3 rounded-2xl hover:border-white/20 hover:text-foreground transition-colors">
              Back to Dashboard
            </button>
          </Link>
          <Link href="/leaderboards" className="w-full">
            <button className="w-full bg-surface-2 border-2 border-white/10 text-muted font-bold py-3 rounded-2xl hover:border-white/20 hover:text-foreground transition-colors">
              🏅 View Leaderboard
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
