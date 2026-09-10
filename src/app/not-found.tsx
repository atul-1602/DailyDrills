import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-16 left-10 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-16 right-10 w-28 h-28 bg-accent/10 rounded-full blur-3xl" />
      <div className="relative bg-surface rounded-3xl p-12 card-shadow text-center max-w-md w-full border border-white/10">
        <div className="text-7xl mb-6">🔭</div>
        <h1 className="text-4xl font-extrabold gradient-brand-text mb-2">404</h1>
        <h2 className="text-xl font-bold text-foreground mb-3">Lost in space, scholar!</h2>
        <p className="text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <button className="w-full gradient-brand text-white font-bold py-3 rounded-2xl glow-shadow transition-shadow cursor-pointer">
              Go to Dashboard
            </button>
          </Link>
          <Link href="/">
            <button className="w-full bg-surface-2 border-2 border-white/10 text-muted font-bold py-3 rounded-2xl hover:border-white/20 hover:text-foreground transition-colors cursor-pointer">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
