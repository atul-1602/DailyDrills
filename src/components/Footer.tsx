import { Heart, Github, Twitter, Mail } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-28 h-28 sm:w-40 sm:h-40 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="text-center">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <span className="text-sm sm:text-base text-muted">Created with</span>
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" fill="currentColor" />
              <span className="text-sm sm:text-base font-semibold text-foreground">
                by Atul
              </span>
            </div>

            <p className="text-muted mb-4 sm:mb-6 text-sm sm:text-base">
              Powered by{' '}
              <span className="font-semibold text-foreground">
                Vercel, Next.js, MongoDB
              </span>
            </p>
          </div>

          {/* Social links */}
          <div className="flex justify-center items-center space-x-4 sm:space-x-6 mb-6 sm:mb-8">
            <a
              href="#"
              className="p-2 sm:p-3 bg-surface-2 border border-white/10 rounded-full hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="p-2 sm:p-3 bg-surface-2 border border-white/10 rounded-full hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              href="#"
              className="p-2 sm:p-3 bg-surface-2 border border-white/10 rounded-full hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>

          <div className="w-full h-px bg-white/10 mb-4 sm:mb-6" />

          <div className="text-muted text-xs sm:text-sm">
            <p>© 2024 Daily Drills. All rights reserved.</p>
            <p className="mt-1 sm:mt-2">
              Made with care for the developer community
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
