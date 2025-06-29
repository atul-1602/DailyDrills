"use client";

import { supabase } from '@/config/supabaseClient';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import QuizCard from '@/components/QuizCard';
import { Loader2 } from 'lucide-react';

interface Quiz {
  id: string;
  topic: string;
  slug: string;
  difficulty: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    answer: string;
  }[];
}

const QuizPage = () => {
  const { slug } = useParams() as { slug: string };

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('quizzes')
          .select('*')
          .eq('slug', slug)
          .single();

        if (data) setQuiz(data);
        else if (error) setError(error.message);
      } catch {
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchQuiz();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500 animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-600 text-sm sm:text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center p-6 sm:p-8 bg-red-50 rounded-2xl border border-red-200 max-w-sm sm:max-w-md">
          <div className="text-red-500 text-4xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
          <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-2">Error Loading Quiz</h2>
          <p className="text-red-600 text-sm sm:text-base mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 sm:px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center p-6 sm:p-8 bg-gray-50 rounded-2xl border border-gray-200 max-w-sm sm:max-w-md">
          <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📚</div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-600 mb-2">Quiz Not Found</h2>
          <p className="text-gray-500 text-sm sm:text-base">The quiz you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <QuizCard questions={quiz.questions} topic={quiz.topic} />
    </div>
  );
};

export default QuizPage;
