"use client";

import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 overflow-hidden relative">

      {/* Background glow accents */}
      <div className="absolute top-20 left-10 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="bg-surface border border-white/10 p-4 rounded-3xl card-shadow mb-8"
        >
          <span className="text-4xl">🚀</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-foreground"
        >
          Learn Smarter. <br />
          <span className="gradient-brand-text">Play Daily.</span> <br />
          Get Better.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-xl md:text-2xl text-muted mb-10"
        >
          AI-powered gamified quizzes for curious minds. Master any subject, anytime.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {isSignedIn ? (
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="gradient-brand text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg glow-shadow transition-shadow cursor-pointer"
              >
                Go to Dashboard →
              </motion.button>
            </Link>
          ) : (
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="gradient-brand text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg glow-shadow transition-shadow cursor-pointer"
              >
                Start Practicing
              </motion.button>
            </SignInButton>
          )}
        </motion.div>
      </div>
    </div>
  );
}
