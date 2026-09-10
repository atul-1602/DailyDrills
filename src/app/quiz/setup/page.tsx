"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// ─── Data ────────────────────────────────────────────────
const GRADES = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Grade 11", "Grade 12",
];

const SUBJECTS = [
  { label: "Mathematics", emoji: "📐" },
  { label: "Science",     emoji: "🔬" },
  { label: "History",     emoji: "🏛️" },
  { label: "Geography",   emoji: "🌍" },
  { label: "English",     emoji: "📖" },
  { label: "Computer",    emoji: "💻" },
  { label: "Finance",     emoji: "💰" },
  { label: "Art",         emoji: "🎨" },
];

const DIFFICULTIES = [
  { key: "easy",   label: "Easy",   emoji: "🌱", color: "border-emerald-400/60 bg-mint" },
  { key: "medium", label: "Medium", emoji: "⚡", color: "border-amber-400/60 bg-peach" },
  { key: "hard",   label: "Hard",   emoji: "🔥", color: "border-rose-400/60 bg-secondary/15" },
  { key: "mixed",  label: "Mixed",  emoji: "🎲", color: "border-primary/60 bg-lavender" },
];

const QUESTION_COUNTS = [5, 10, 15, 20];

// ─── Step Indicator ─────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i === current ? 32 : 8 }}
          transition={{ duration: 0.2 }}
          className={`h-2 rounded-full ${
            i <= current ? "bg-primary" : "bg-surface-2"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main Setup Wizard ───────────────────────────────────
export default function QuizSetup() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [form, setForm] = useState({
    grade: "",
    subject: "",
    topic: "",
    difficulty: "medium",
    questionCount: 10,
  });

  const steps = ["Grade", "Subject", "Topic & Difficulty", "Let's Go!"];
  const canNext =
    (step === 0 && form.grade) ||
    (step === 1 && form.subject) ||
    (step === 2 && form.topic.trim()) ||
    step === 3;

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success && data.quizId) {
        router.push(`/quiz/play/${data.quizId}`);
      } else {
        setGenerateError(data.error || "Failed to generate quiz. Please try again.");
      }
    } catch {
      setGenerateError("Network error. Please check your connection and try again.");
    } finally {
      setGenerating(false);
    }
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else handleGenerate();
  };
  const back = () => step > 0 && setStep(step - 1);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <h1 className="text-3xl font-black text-foreground mb-1">Create Your Quiz</h1>
          <p className="text-muted mb-6">Step {step + 1} of {steps.length}: {steps[step]}</p>
          <StepIndicator current={step} total={steps.length} />
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-surface border border-white/10 rounded-3xl p-6 card-shadow mb-6"
          >

            {/* Step 0: Grade Selection */}
            {step === 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {GRADES.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setForm({ ...form, grade })}
                    className={`py-3 px-2 rounded-2xl font-bold text-sm transition-colors border-2 ${
                      form.grade === grade
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-surface-2 text-muted border-white/10 hover:border-primary/50"
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            )}

            {/* Step 1: Subject Selection */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {SUBJECTS.map(({ label, emoji }) => (
                  <button
                    key={label}
                    onClick={() => setForm({ ...form, subject: label })}
                    className={`flex items-center gap-3 py-4 px-5 rounded-2xl font-bold text-base transition-colors border-2 ${
                      form.subject === label
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-surface-2 text-muted border-white/10 hover:border-primary/50"
                    }`}
                  >
                    <span className="text-2xl">{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Topic + Difficulty + Count */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Topic Input */}
                <div>
                  <label className="block text-sm font-bold text-muted mb-2">
                    Enter a specific topic
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. "Fractions", "Solar System", "WW2"...`}
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full bg-surface-2 border-2 border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/40 outline-none rounded-2xl px-4 py-3 text-foreground placeholder:text-muted/70 font-semibold transition-colors"
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-bold text-muted mb-2">Difficulty</label>
                  <div className="grid grid-cols-2 gap-3">
                    {DIFFICULTIES.map(({ key, label, emoji, color }) => (
                      <button
                        key={key}
                        onClick={() => setForm({ ...form, difficulty: key })}
                        className={`flex items-center gap-2 py-3 px-4 rounded-2xl font-bold border-2 text-foreground transition-colors ${
                          form.difficulty === key
                            ? `${color} shadow-md`
                            : "bg-surface-2 border-white/10 text-muted hover:border-white/20"
                        }`}
                      >
                        <span>{emoji}</span> {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div>
                  <label className="block text-sm font-bold text-muted mb-2">
                    Number of Questions
                  </label>
                  <div className="flex gap-3">
                    {QUESTION_COUNTS.map((count) => (
                      <button
                        key={count}
                        onClick={() => setForm({ ...form, questionCount: count })}
                        className={`flex-1 py-3 rounded-2xl font-black text-lg border-2 transition-colors ${
                          form.questionCount === count
                            ? "bg-primary text-white border-primary shadow-md"
                            : "bg-surface-2 text-muted border-white/10 hover:border-primary/50"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Summary */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-foreground mb-4">Quiz Summary</h3>
                {[
                  { label: "Grade",       value: form.grade,                    emoji: "🏫" },
                  { label: "Subject",     value: form.subject,                  emoji: "📚" },
                  { label: "Topic",       value: form.topic,                    emoji: "🎯" },
                  { label: "Difficulty",  value: form.difficulty.toUpperCase(), emoji: "⚡" },
                  { label: "Questions",   value: `${form.questionCount}`,       emoji: "❓" },
                ].map(({ label, value, emoji }) => (
                  <div key={label} className="flex items-center gap-4 bg-surface-2 rounded-2xl p-4">
                    <span className="text-2xl">{emoji}</span>
                    <div>
                      <p className="text-xs text-muted font-semibold uppercase">{label}</p>
                      <p className="font-bold text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {step > 0 && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={back}
              className="flex-1 bg-surface border-2 border-white/10 text-muted font-bold py-4 rounded-2xl hover:border-white/20 hover:text-foreground transition-colors"
            >
              ← Back
            </motion.button>
          )}
          <motion.button
            whileHover={canNext ? { scale: 1.01 } : {}}
            whileTap={canNext ? { scale: 0.98 } : {}}
            transition={{ duration: 0.15 }}
            onClick={next}
            disabled={!canNext || generating}
            className={`flex-1 font-bold py-4 rounded-2xl text-lg transition-colors ${
              canNext && !generating
                ? "gradient-brand text-white shadow-lg glow-shadow cursor-pointer"
                : "bg-surface-2 text-muted cursor-not-allowed"
            }`}
          >
            {generating
              ? "Creating Quiz…"
              : step === steps.length - 1
              ? "Generate Quiz"
              : "Next →"}
          </motion.button>
        </div>

        {/* Error Message */}
        {generateError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 bg-secondary/10 border border-secondary/30 text-rose-300 rounded-2xl px-4 py-3 text-sm font-medium text-center"
          >
            ⚠️ {generateError}
          </motion.div>
        )}
      </div>
    </div>
  );
}
