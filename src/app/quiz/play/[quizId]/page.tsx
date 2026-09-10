"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────
interface SafeQuestion {
  id: string;
  question: string;
  options: string[];
  difficulty: "easy" | "medium" | "hard";
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  questions: SafeQuestion[];
}

interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: number;
  explanation: string;
  pointsEarned: number;
}

// ─── Timer constants ───────────────────────────────────────
const SECONDS_PER_QUESTION = 30;

// ─── Difficulty badge ──────────────────────────────────────
const DIFF_STYLE: Record<string, string> = {
  easy: "bg-mint text-emerald-300 border border-emerald-400/20",
  medium: "bg-peach text-amber-300 border border-amber-400/20",
  hard: "bg-secondary/15 text-rose-300 border border-rose-400/20",
};

export default function QuizPlay() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.quizId as string;

  // ─── State ─────────────────────────────────────────────
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // ─── Load quiz + start attempt on mount ───────────────
  useEffect(() => {
    async function initialize() {
      try {
        // 1. Fetch quiz questions
        const quizRes = await fetch(`/api/quiz/${quizId}`);
        const quizData = await quizRes.json();
        if (!quizData.success) {
          setError(quizData.error || "Quiz not found.");
          return;
        }
        setQuiz(quizData.quiz);

        // 2. Create a QuizAttempt in the DB
        const startRes = await fetch("/api/quiz/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizId }),
        });
        const startData = await startRes.json();
        if (!startData.success) {
          setError(startData.error || "Failed to start quiz.");
          return;
        }
        setAttemptId(startData.attemptId);
      } catch {
        setError("Network error. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [quizId]);

  // ─── Timer ─────────────────────────────────────────────
  useEffect(() => {
    if (loading || isAnswered || !quiz) return;
    if (timeLeft <= 0) {
      handleAnswerSubmit(-1); // timed out
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isAnswered, loading, quiz]);

  // ─── Submit an answer ──────────────────────────────────
  const handleAnswerSubmit = useCallback(
    async (optionIndex: number) => {
      if (isAnswered || submitting || !quiz || !attemptId) return;
      setSelectedOption(optionIndex);
      setIsAnswered(true);
      setSubmitting(true);

      try {
        const res = await fetch("/api/quiz/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId,
            attemptId,
            questionIndex: currentIndex,
            selectedOption: optionIndex,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setResult(data);
          if (data.isCorrect) setTotalScore((s) => s + data.pointsEarned);
        }
      } catch {
        console.error("Failed to submit answer");
      } finally {
        setSubmitting(false);
      }
    },
    [isAnswered, submitting, quiz, attemptId, quizId, currentIndex]
  );

  // ─── Advance to next question or complete quiz ─────────
  const handleNext = useCallback(async () => {
    if (!quiz) return;
    const isLastQuestion = currentIndex >= quiz.questions.length - 1;

    if (isLastQuestion) {
      // Complete the quiz
      try {
        const res = await fetch("/api/quiz/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizId, attemptId }),
        });
        const data = await res.json();
        if (data.success) {
          // Pass result to result page via URL params
          router.push(
            `/quiz/result/${quizId}?attemptId=${attemptId}`
          );
        }
      } catch {
        router.push(`/quiz/result/${quizId}?attemptId=${attemptId}`);
      }
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setResult(null);
      setTimeLeft(SECONDS_PER_QUESTION);
    }
  }, [quiz, currentIndex, quizId, attemptId, router]);

  // ─── Styling helpers ───────────────────────────────────
  const timerColor =
    timeLeft > 15 ? "bg-accent" : timeLeft > 7 ? "bg-amber-400" : "bg-secondary";
  const timerBadgeColor =
    timeLeft > 15
      ? "text-emerald-300 bg-mint"
      : timeLeft > 7
      ? "text-amber-300 bg-peach"
      : "text-rose-300 bg-secondary/15";

  const getOptionClass = (index: number) => {
    if (!isAnswered) {
      return "bg-surface border-2 border-white/10 text-foreground hover:border-primary/50 hover:bg-surface-2 cursor-pointer";
    }
    if (result?.correctAnswer === index) {
      return "bg-mint border-2 border-accent text-emerald-200 font-bold shadow-lg cursor-default";
    }
    if (selectedOption === index && index !== result?.correctAnswer) {
      return "bg-secondary/10 border-2 border-secondary text-rose-200 cursor-default";
    }
    return "bg-surface-2 border-2 border-white/10 text-muted opacity-50 cursor-default";
  };

  // ─── Loading / Error States ────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent"
        />
        <p className="text-muted font-semibold text-lg">Loading your quiz…</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-4">
        <div className="bg-surface border border-white/10 rounded-3xl p-10 card-shadow text-center max-w-md w-full">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Not Found</h2>
          <p className="text-muted mb-6">{error ?? "Something went wrong."}</p>
          <button
            onClick={() => router.push("/quiz/setup")}
            className="bg-primary text-white font-bold py-3 px-8 rounded-2xl hover:bg-primary/90 transition-colors"
          >
            Create New Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / quiz.questions.length) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 md:p-10 font-sans">

      {/* Top Bar */}
      <header className="w-full max-w-2xl flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <span className="font-bold text-foreground text-lg">{totalScore} XP</span>
        </div>
        <div className="text-muted font-bold bg-surface border border-white/10 px-4 py-1 rounded-full card-shadow text-sm">
          {currentIndex + 1} / {quiz.questions.length}
        </div>
        <div className={`font-black text-lg px-4 py-1 rounded-full ${timerBadgeColor}`}>
          {timeLeft}s
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-4">
        <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full max-w-2xl bg-surface-2 h-3 rounded-full mb-8 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${timerColor}`}
          animate={{ width: `${(timeLeft / SECONDS_PER_QUESTION) * 100}%` }}
          transition={{ ease: "linear", duration: 1 }}
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-2xl bg-surface border border-white/10 rounded-3xl p-8 md:p-12 card-shadow text-center mb-8 relative overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0 pointer-events-none" />

          {/* Difficulty badge */}
          <div className="flex justify-center mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${DIFF_STYLE[currentQuestion.difficulty] ?? ""}`}>
              {currentQuestion.difficulty}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-extrabold text-foreground relative z-10 leading-relaxed">
            {currentQuestion.question}
          </h2>
        </motion.div>
      </AnimatePresence>

      {/* Answer Options */}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => (
          <motion.button
            key={`${currentIndex}-${index}`}
            whileHover={!isAnswered ? { scale: 1.015 } : {}}
            whileTap={!isAnswered ? { scale: 0.98 } : {}}
            animate={
              isAnswered && (index === result?.correctAnswer || (selectedOption === index && index !== result?.correctAnswer))
                ? { scale: [1, 1.03, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.25 }}
            onClick={() => handleAnswerSubmit(index)}
            disabled={isAnswered || submitting}
            className={`p-6 rounded-2xl text-base md:text-lg font-semibold transition-colors duration-200 text-left flex items-center gap-3 ${getOptionClass(index)}`}
          >
            <span className="w-8 h-8 flex-shrink-0 rounded-full bg-surface-2 flex items-center justify-center text-sm font-black text-muted">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="leading-snug">{option}</span>
          </motion.button>
        ))}
      </div>

      {/* Explanation + Next Button */}
      <AnimatePresence>
        {isAnswered && result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl mt-8 flex flex-col items-center"
          >
            {/* Feedback card */}
            <div
              className={`w-full p-6 rounded-2xl mb-6 ${
                result.isCorrect
                  ? "bg-mint text-emerald-200 border border-emerald-400/20"
                  : "bg-secondary/10 text-rose-200 border border-rose-400/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="text-2xl"
                >
                  {result.isCorrect ? "🎉" : "❌"}
                </motion.span>
                <h3 className="text-lg font-bold">
                  {result.isCorrect
                    ? `Brilliant! +${result.pointsEarned} XP`
                    : "Not quite!"}
                </h3>
              </div>
              <p className="text-sm leading-relaxed opacity-90">{result.explanation}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              onClick={handleNext}
              className="gradient-brand text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg glow-shadow transition-shadow cursor-pointer"
            >
              {currentIndex >= quiz.questions.length - 1 ? "See Results 🎊" : "Next Question →"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz meta footer */}
      <p className="mt-8 text-muted text-xs font-medium">
        {quiz.subject} · {quiz.topic} · {quiz.grade}
      </p>
    </div>
  );
}
