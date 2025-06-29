import React from 'react'

const HomeBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-secondary min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
      <div className="absolute top-4 left-4 sm:top-10 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/10 rounded-full blur-xl animate-pulse-slow"></div>
      <div className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 bg-white/10 rounded-full blur-xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/10 rounded-full blur-lg animate-bounce-slow"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in-up">
        <div className="mb-4 sm:mb-6">
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-medium mb-3 sm:mb-4 animate-fade-in-scale">
            🚀 Ready to Challenge Yourself?
          </span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
          Test your knowledge by taking{' '}
          <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            quizzes
          </span>
        </h1>
        
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-2">
          All questions sorted via categories and curated by users.{' '}
          <span className="text-yellow-200 font-semibold">Start learning today!</span>
        </h3>
        
        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
          <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base">
            Start Quiz Now
          </button>
          <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-sm sm:text-base">
            Browse Categories
          </button>
        </div>
        
        {/* Stats */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-8 mt-8 sm:mt-12 text-white/80 px-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-white">500+</div>
            <div className="text-xs sm:text-sm">Questions</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/30"></div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-white">50+</div>
            <div className="text-xs sm:text-sm">Categories</div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/30"></div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-white">10K+</div>
            <div className="text-xs sm:text-sm">Users</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeBanner