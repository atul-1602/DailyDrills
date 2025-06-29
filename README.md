# DailyDrills
A daily quiz web app built with Next.js and Supabase to help developers learn through MCQs.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

<img width="1512" alt="Screenshot 2025-06-30 at 1 14 10 AM" src="https://github.com/user-attachments/assets/e9ebaf86-2abb-4cfb-8226-8db928d2495b" />
<img width="1512" alt="Screenshot 2025-06-30 at 1 14 21 AM" src="https://github.com/user-attachments/assets/190ccf65-2aea-49a9-859a-eeda8fa2abf9" />
<img width="1512" alt="Screenshot 2025-06-30 at 1 14 49 AM" src="https://github.com/user-attachments/assets/5e2162f4-0fad-469c-951f-8c69831d2be0" />




# Quiz App

A modern quiz application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- ✅ Create and manage quizzes
- ✅ Add multiple choice questions
- ✅ Modern, responsive UI
- ✅ TypeScript for type safety
- ✅ Supabase for data persistence
- ✅ Real-time updates

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (ready to implement)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd quiz-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API
3. Create the following tables in your Supabase SQL editor:

#### Quizzes Table
```sql
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Questions Table
```sql
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Create your first quiz and start testing!

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── quiz/
│       └── create/
│           └── page.tsx   # Quiz creation page
├── components/            # React components
│   └── QuizCard.tsx      # Quiz card component
└── lib/                  # Utility functions
    ├── supabase.ts       # Supabase client
    └── quiz-utils.ts     # Quiz operations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Next Steps

- [ ] Add quiz taking functionality
- [ ] Implement user authentication
- [ ] Add quiz results and scoring
- [ ] Create quiz editing functionality
- [ ] Add quiz sharing features
- [ ] Implement real-time collaboration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
