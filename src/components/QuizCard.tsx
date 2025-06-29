// components/QuizCard.tsx
import Link from 'next/link';
import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowLeft, ArrowRight, Trophy, Home } from 'lucide-react';

interface Question {
    id: string;
    question: string;
    options: string[];
    answer: string;
}

interface QuizCardProps {
    questions: Question[];
    topic: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ questions, topic }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [userAnswers, setUserAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));

    const current = questions[currentIndex];
    const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

    const handleOptionClick = (option: string) => {
        if (isAnswered) return;

        const isCorrect = option === current.answer;
        setSelectedOption(option);
        setIsAnswered(true);

        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentIndex] = option;
        setUserAnswers(updatedAnswers);

        if (isCorrect) setScore((prev) => prev + 1);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(userAnswers[currentIndex + 1]);
        setIsAnswered(!!userAnswers[currentIndex + 1]);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => prev - 1);
        setSelectedOption(userAnswers[currentIndex - 1]);
        setIsAnswered(!!userAnswers[currentIndex - 1]);
    };

    const handleSubmit = () => {
        setShowScore(true);
    };

    const getOptionClass = (option: string) => {
        if (!isAnswered) {
            return 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-300 hover:scale-105';
        }

        if (option === current.answer) {
            return 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-400 text-green-800 shadow-lg';
        }
        if (option === selectedOption && option !== current.answer) {
            return 'bg-gradient-to-r from-red-100 to-pink-100 border-red-400 text-red-800 shadow-lg';
        }
        return 'bg-gray-50 border-gray-200 text-gray-600';
    };

    if (showScore) {
        const percentage = Math.round((score / questions.length) * 100);
        const isExcellent = percentage >= 90;
        const isGood = percentage >= 70;
        const isAverage = percentage >= 50;

        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
                <div className="max-w-sm sm:max-w-md w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center animate-fade-in-scale">
                    {/* Trophy Icon */}
                    <div className="mb-4 sm:mb-6">
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center ${isExcellent ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                                isGood ? 'bg-gradient-to-r from-blue-400 to-purple-400' :
                                    isAverage ? 'bg-gradient-to-r from-green-400 to-teal-400' :
                                        'bg-gradient-to-r from-red-400 to-pink-400'
                            }`}>
                            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                        {isExcellent ? '🎉 Excellent!' :
                            isGood ? '🎯 Great Job!' :
                                isAverage ? '👍 Good Work!' : '💪 Keep Going!'}
                    </h2>

                    <div className="mb-4 sm:mb-6">
                        <div className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                            {score}/{questions.length}
                        </div>
                        <div className="text-base sm:text-lg text-gray-600">
                            {percentage}% Score
                        </div>
                    </div>

                    {/* Progress Circle */}
                    <div className="mb-6 sm:mb-8">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                            <svg
                                viewBox="0 0 96 96"
                                className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90"
                            >
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-gray-200"
                                />
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={`${2 * Math.PI * 40}`}
                                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                                    className={`transition-all duration-1000 ${isExcellent
                                            ? 'text-yellow-500'
                                            : isGood
                                                ? 'text-blue-500'
                                                : isAverage
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                        }`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg sm:text-2xl font-bold text-gray-700">
                                    {percentage}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <Link href="/">
                        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base">
                            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                            Go to Home
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-3 sm:p-4">
            <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 animate-fade-in-up">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                            {topic} Quiz
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base">Test your knowledge and improve your skills</p>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex justify-between items-center mb-2 sm:mb-3">
                            <div className="text-xs sm:text-sm font-medium text-gray-600">
                                Question {currentIndex + 1} of {questions.length}
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-purple-600">
                                {progressPercent}%
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 sm:h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Question */}
                    <div className="mb-6 sm:mb-8">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                            <p className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 leading-relaxed">
                                Q{currentIndex + 1}. {current.question}
                            </p>
                        </div>

                        {/* Options */}
                        <div className="space-y-3 sm:space-y-4">
                            {current.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleOptionClick(option)}
                                    disabled={isAnswered}
                                    className={`w-full p-3 sm:p-4 text-left border-2 rounded-lg sm:rounded-xl transition-all duration-300 font-medium text-sm sm:text-base ${isAnswered ? 'cursor-default' : 'cursor-pointer'
                                        } ${getOptionClass(option)}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 sm:gap-3">
                                            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-sm font-bold text-gray-600">
                                                {String.fromCharCode(65 + index)}
                                            </span>
                                            {option}
                                        </span>
                                        {isAnswered && option === current.answer && (
                                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                        )}
                                        {isAnswered && option === selectedOption && option !== current.answer && (
                                            <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Feedback */}
                        {isAnswered && (
                            <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl animate-fade-in-scale">
                                {selectedOption === current.answer ? (
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                        <div className="flex items-center gap-2 sm:gap-3 text-green-700">
                                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                                            <span className="font-semibold text-sm sm:text-base">Correct! Well done!</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                        <div className="flex items-center gap-2 sm:gap-3 text-red-700 mb-1 sm:mb-2">
                                            <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                                            <span className="font-semibold text-sm sm:text-base">Incorrect</span>
                                        </div>
                                        <p className="text-red-600 text-sm sm:text-base">
                                            Correct answer: <span className="font-semibold text-green-700">{current.answer}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${currentIndex === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 hover:scale-105 shadow-lg'
                                }`}
                        >
                            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                            Previous
                        </button>

                        {currentIndex < questions.length - 1 ? (
                            <button
                                onClick={handleNext}
                                disabled={!isAnswered}
                                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${!isAnswered
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 shadow-lg'
                                    }`}
                            >
                                Next
                                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={!isAnswered}
                                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${!isAnswered
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:scale-105 shadow-lg'
                                    }`}
                            >
                                Submit Quiz
                                <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizCard;