import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DailyDrills — AI-Powered Quiz Platform",
    template: "%s | DailyDrills",
  },
  description:
    "DailyDrills is an AI-powered gamified quiz platform for students. Master any subject with adaptive quizzes, real-time scoring, and global leaderboards.",
  keywords: ["quiz", "edtech", "AI", "learning", "students", "gamified"],
  openGraph: {
    title: "DailyDrills — Learn Smarter. Play Daily.",
    description: "AI-powered gamified quizzes for curious minds.",
    type: "website",
    url: siteUrl,
    siteName: "DailyDrills",
  },
  twitter: {
    card: "summary_large_image",
    title: "DailyDrills — Learn Smarter. Play Daily.",
    description: "AI-powered gamified quizzes for curious minds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#818cf8",
          colorBackground: "#16181d",
          colorForeground: "#e7e9ee",
          colorMutedForeground: "#9aa0ac",
          colorInput: "#1c1f27",
          colorInputForeground: "#e7e9ee",
          colorNeutral: "#e7e9ee",
          colorDanger: "#fb7185",
          colorSuccess: "#34d399",
          borderRadius: "1rem",
        },
        elements: {
          card: "bg-surface border border-white/10 shadow-2xl",
          modalBackdrop: "backdrop-blur-sm",
        },
      }}
    >
      <html lang="en" className="scroll-smooth dark" style={{ colorScheme: "dark" }}>
        <body
          className={`${nunito.variable} antialiased min-h-screen font-sans bg-background`}
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
