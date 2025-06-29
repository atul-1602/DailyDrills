'use client'

import { Trophy, Plus, Menu, X, Brain } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-gradient-primary shadow-lg backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full backdrop-blur-sm">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-white font-bold text-lg sm:text-xl lg:text-2xl tracking-wide animate-fade-in-up">
                Daily Drills
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <div className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors duration-300 cursor-pointer group">
              <Trophy className="w-4 h-4 lg:w-5 lg:h-5 group-hover:animate-bounce-slow" />
              <span className="font-medium text-sm lg:text-base">Top Contributors</span>
            </div>

            <div className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors duration-300 cursor-pointer group">
              <Plus className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium text-sm lg:text-base">Submit a question</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`
            md:hidden absolute top-full left-0 right-0 z-40
            bg-white/80 dark:bg-white/10 
            backdrop-blur-3xl 
            border border-white/30 dark:border-white/20
            shadow-2xl
            text-gray-900 dark:text-white
            transition-all duration-300 ease-in-out
            m-2
            rounded-2xl
            ${
              isMobileMenuOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }
          `}
        >
          <div className="px-4 py-3 space-y-1">
            <div className="flex items-center space-x-2 text-gray-900 dark:text-white/90 hover:text-black dark:hover:text-white transition-colors duration-300 cursor-pointer group px-3 py-2 rounded-md hover:bg-white/10">
              <Trophy className="w-4 h-4 group-hover:animate-bounce-slow" />
              <span className="font-medium text-sm">Top Contributors</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-900 dark:text-white/90 hover:text-black dark:hover:text-white transition-colors duration-300 cursor-pointer group px-3 py-2 rounded-md hover:bg-white/10">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium text-sm">Submit a question</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
