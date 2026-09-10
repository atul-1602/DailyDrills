"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-16 left-10 w-24 h-24 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-10 w-28 h-28 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative bg-surface rounded-3xl p-12 card-shadow text-center max-w-md w-full border border-white/10"
      >
        <div className="text-7xl mb-6">⚠️</div>
        <h1 className="text-2xl font-extrabold text-foreground mb-2">Oops, something glitched</h1>
        <p className="text-muted mb-2 text-sm">
          {error?.message || "An unexpected error occurred."}
        </p>
        {error?.digest && (
          <p className="text-xs text-muted/60 mb-6 font-mono">ID: {error.digest}</p>
        )}
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onClick={reset}
            className="w-full gradient-brand text-white font-bold py-3 rounded-2xl glow-shadow transition-shadow cursor-pointer"
          >
            Try Again
          </motion.button>
          <Link href="/dashboard">
            <button className="w-full bg-surface-2 border-2 border-white/10 text-muted font-bold py-3 rounded-2xl hover:border-white/20 hover:text-foreground transition-colors cursor-pointer">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
