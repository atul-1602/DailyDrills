"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/quiz/setup", label: "New Quiz", icon: "🚀" },
  { href: "/leaderboards", label: "Leaderboard", icon: "🏅" },
];

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b transition-colors duration-200 ${
        scrolled ? "border-white/10" : "border-white/5"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🧠</span>
          <span className="font-extrabold gradient-brand-text text-lg">DailyDrills</span>
        </Link>

        {/* Desktop links */}
        {isSignedIn && (
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon }) => (
              <Link key={href} href={href} className="relative">
                <button
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors z-10 cursor-pointer ${
                    pathname === href
                      ? "text-primary"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {pathname === href && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span>{icon}</span>
                  {label}
                </button>
              </Link>
            ))}
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-xl bg-surface-2 text-muted hover:text-foreground transition-colors"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="gradient-brand text-white font-bold px-5 py-2 rounded-full text-sm shadow-sm glow-shadow transition-shadow cursor-pointer"
              >
                Sign In
              </motion.button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isSignedIn && mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-background px-4 pb-4 pt-2 space-y-1">
          {NAV_LINKS.map(({ href, label, icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
              <button
                className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                  pathname === href
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-surface-2 hover:text-foreground"
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
