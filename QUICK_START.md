# Quick Start Guide

## 🚀 Get Your Quiz App Running in 5 Minutes

### Step 1: Start the Development Server
```bash
npm run dev
```
The app will start at http://localhost:3000

### Step 2: Set Up Supabase (Required for full functionality)

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Sign up/Login and create a new project
   - Wait for the project to be ready

2. **Get Your Credentials**
   - Go to Settings → API in your Supabase dashboard
   - Copy the "Project URL" and "anon public" key

3. **Create Environment File**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Create Database Tables**
   - Go to SQL Editor in your Supabase dashboard
   - Run these SQL commands:

   ```sql
   -- Create quizzes table
   CREATE TABLE quizzes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create questions table
   CREATE TABLE questions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
     question_text TEXT NOT NULL,
     options TEXT[] NOT NULL,
     correct_answer INTEGER NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Step 3: Test Your App
- Refresh your browser at http://localhost:3000
- Click "Create New Quiz" to test the functionality
- Add questions and save your first quiz!

## 🎯 What You Can Do Now

- ✅ Create quizzes with multiple questions
- ✅ Add multiple choice options
- ✅ Set correct answers
- ✅ View all your quizzes
- ✅ Delete quizzes
- ✅ Modern, responsive UI

## 🔧 Troubleshooting

**"Supabase not configured" error?**
- Make sure you created the `.env.local` file
- Check that your Supabase URL and key are correct
- Restart the development server after adding environment variables

**Database errors?**
- Make sure you created both tables in Supabase
- Check that the SQL commands ran successfully

**App not loading?**
- Check the browser console for errors
- Make sure all dependencies are installed: `npm install`

## 📱 Next Features to Add

- [ ] Take quizzes and see results
- [ ] User authentication
- [ ] Quiz sharing
- [ ] Quiz editing
- [ ] Real-time collaboration

Happy quizzing! 🎉 