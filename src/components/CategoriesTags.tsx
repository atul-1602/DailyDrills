import React from 'react'

const CategoriesTags = ({topic="Html", count=20}: {topic: string, count: number}) => {
  // Generate a random gradient for variety
  const gradients = [
    'bg-gradient-to-br from-blue-400 to-purple-500',
    'bg-gradient-to-br from-green-400 to-blue-500',
    'bg-gradient-to-br from-purple-400 to-pink-500',
    'bg-gradient-to-br from-yellow-400 to-orange-500',
    'bg-gradient-to-br from-red-400 to-pink-500',
    'bg-gradient-to-br from-indigo-400 to-purple-500',
    'bg-gradient-to-br from-teal-400 to-blue-500',
    'bg-gradient-to-br from-pink-400 to-red-500'
  ]
  
  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)]
  
  return (
    <div className={`
      relative group cursor-pointer rounded-xl sm:rounded-2xl p-4 sm:p-6 h-24 sm:h-28 md:h-32 
      ${randomGradient} 
      shadow-lg hover:shadow-2xl 
      transition-all duration-500 ease-out
      hover:scale-105 hover:-translate-y-1 sm:hover:-translate-y-2
      overflow-hidden
      animate-fade-in-scale
    `}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6 sm:-translate-y-10 sm:translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/10 rounded-full translate-y-4 -translate-x-4 sm:translate-y-8 sm:-translate-x-8 group-hover:scale-150 transition-transform duration-500" style={{animationDelay: '0.2s'}}></div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-sm sm:text-lg md:text-xl group-hover:text-lg sm:group-hover:text-xl md:group-hover:text-2xl transition-all duration-300 leading-tight">
            {topic}
          </h2>
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
            <span className="text-white text-xs font-bold">📚</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/60 rounded-full animate-pulse"></div>
            <span className="text-white/90 text-xs sm:text-sm font-medium">Available</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 sm:px-3 sm:py-1">
            <span className="text-white font-bold text-sm sm:text-base md:text-lg">{count}</span>
            <span className="text-white/80 text-xs ml-0.5 sm:ml-1">qs</span>
          </div>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}

export default CategoriesTags