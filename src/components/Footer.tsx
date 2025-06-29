import { Heart, Github, Twitter, Mail } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
      <div className="absolute top-0 left-1/4 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 bg-pink-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center">
          {/* Main content */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <span className="text-sm sm:text-lg">Created with</span>
              <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-red-500 animate-pulse-slow" fill="#ef4444" />
              <span className="text-sm sm:text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                by Atul
              </span>
            </div>
            
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
              Powered by{' '}
              <span className="font-semibold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                Vercel, Next.js, Supabase
              </span>
            </p>
          </div>

          {/* Social links */}
          <div className="flex justify-center items-center space-x-4 sm:space-x-6 mb-6 sm:mb-8">
            <a 
              href="#" 
              className="p-2 sm:p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 backdrop-blur-sm group"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-purple-300 transition-colors" />
            </a>
            <a 
              href="#" 
              className="p-2 sm:p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 backdrop-blur-sm group"
            >
              <Twitter className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-blue-300 transition-colors" />
            </a>
            <a 
              href="#" 
              className="p-2 sm:p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 backdrop-blur-sm group"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-green-300 transition-colors" />
            </a>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-4 sm:mb-6"></div>

          {/* Copyright */}
          <div className="text-gray-400 text-xs sm:text-sm">
            <p>© 2024 Daily Drills. All rights reserved.</p>
            <p className="mt-1 sm:mt-2">
              Made with ❤️ for the developer community
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer