import React from 'react'
import { Trash2 } from 'lucide-react'

const ClearQuizButton = () => {
  return (
    <div className="pb-6 sm:pb-8 px-4 flex justify-center">
      <button className="
        group relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 
        bg-gradient-to-r from-red-500 to-pink-500 
        text-white font-medium rounded-full 
        shadow-lg hover:shadow-xl 
        transition-all duration-300 ease-out
        hover:scale-105 hover:-translate-y-1
        overflow-hidden
        animate-fade-in-up
        text-sm sm:text-base
      ">
        {/* Background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Icon */}
        <div className="relative z-10">
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
        </div>
        
        {/* Text */}
        <span className="relative z-10">Clear Quiz</span>
        
        {/* Hover effect */}
        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </button>
    </div>
  )
}

export default ClearQuizButton