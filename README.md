# DailyDrills

An AI-powered, gamified quiz platform for students. Pick a grade, subject, and topic, and Gemini generates a fresh quiz on the spot — with scoring, streaks, XP, and a global leaderboard to keep you coming back daily.

**Live app:** [daily-drills.vercel.app](https://daily-drills.vercel.app)

![Uploading image.png…]()

<img width="1512" height="833" alt="DailyDrills dashboard" src="https://github.com/user-attachments/assets/04cebdbc-cd44-41ad-9de3-439a19549685" />

<img width="1507" height="825" alt="DailyDrills quiz" src="https://github.com/user-attachments/assets/25660dd4-cf07-4645-a26b-badcb4517321" />

## Features

- 🤖 **AI-generated quizzes** — Google Gemini (`@ai-sdk/google`) generates questions on demand for any grade/subject/topic/difficulty combination
- 🔐 **Authentication** — Clerk handles sign-in, sessions, and route protection
- 🏆 **Gamification** — XP, streaks, accuracy tracking, and a global/grade/subject leaderboard
- 📊 **Personal dashboard** — quiz history, stats, and progress at a glance
- 🌙 **Dark-mode-only UI** — a single, polished dark theme built with Tailwind CSS v4 and Framer Motion
- 📱 Fully responsive, with SEO basics (metadata, `robots.txt`, `sitemap.xml`) built in

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4, Framer Motion |
| Auth | [Clerk](https://clerk.com) |
| Database | MongoDB + Mongoose |
| AI | Google Gemini via [Vercel AI SDK](https://sdk.vercel.ai) (`ai` + `@ai-sdk/google`) |
| Validation | Zod |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster
- A [Clerk](https://dashboard.clerk.com) application
- A [Google AI Studio](https://aistudio.google.com/apikey) API key (Gemini)

### Installation

```bash
git clone https://github.com/atul-1602/DailyDrills.git
cd DailyDrills
npm install
```

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

```env
# Clerk Authentication — https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# MongoDB connection string — https://cloud.mongodb.com
MONGODB_URI=

# Google Gemini AI — https://aistudio.google.com/apikey
GOOGLE_GENERATIVE_AI_API_KEY=

# Optional: your production domain, used for metadata/sitemap/robots
NEXT_PUBLIC_SITE_URL=
```

In MongoDB Atlas, make sure **Network Access** allows connections from wherever your app runs (`0.0.0.0/0` for Vercel/serverless, since it doesn't use static IPs), and that your **Database User** has read/write access. No manual schema setup is needed — Mongoose creates collections (`quizzes`, `quizattempts`, `userstats`) on first write.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx                     # Landing page
│   ├── layout.tsx                   # Root layout, Clerk provider, metadata
│   ├── dashboard/page.tsx           # User dashboard (stats, streak, history)
│   ├── leaderboards/page.tsx        # Global/grade/subject leaderboards
│   ├── quiz/
│   │   ├── setup/page.tsx           # Choose grade/subject/topic/difficulty
│   │   ├── play/[quizId]/page.tsx   # Take the quiz
│   │   └── result/[quizId]/page.tsx # Score summary
│   ├── api/
│   │   ├── quiz/generate/route.ts   # Generates a quiz via Gemini + saves it
│   │   ├── quiz/start/route.ts      # Starts a quiz attempt
│   │   ├── quiz/answer/route.ts     # Submits an answer
│   │   ├── quiz/complete/route.ts   # Finalizes an attempt, updates stats
│   │   ├── quiz/[quizId]/route.ts   # Fetches a quiz (answers stripped)
│   │   ├── leaderboard/route.ts     # Leaderboard data
│   │   └── user/{stats,history}/    # Per-user stats and quiz history
│   ├── robots.ts / sitemap.ts       # SEO metadata routes
│   └── error.tsx / not-found.tsx    # Error/empty states
├── components/                      # Navbar, Footer, QuizCard, etc.
├── lib/
│   ├── db.ts                        # Cached Mongoose connection
│   └── validation.ts                # Zod schemas for API payloads
├── models/                           # Quiz, QuizAttempt, UserStats (Mongoose)
└── middleware.ts                     # Clerk route protection
```

## Available Scripts

- `npm run dev` — start the dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — start the production server
- `npm run lint` — run ESLint

## Deploying to Vercel

1. Push to GitHub and import the repo into Vercel.
2. Add the environment variables above under **Project Settings → Environment Variables** for the Production environment.
3. Clerk production instances require DNS verification on a domain you control — a `*.vercel.app` domain can't be verified this way, so use Clerk **test/development** keys until you attach a custom domain, then switch to `pk_live_`/`sk_live_` keys.
4. Deploy — `next build`/`next start` work out of the box, no extra config needed.

## Roadmap

- [ ] Quiz history filtering/search
- [ ] Social sharing of results
- [ ] Custom domain + Clerk production instance
- [ ] Additional question types (not just MCQ)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
