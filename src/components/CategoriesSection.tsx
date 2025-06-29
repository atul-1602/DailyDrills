'use client'
import React, { useEffect, useState } from 'react'
import CategoriesTags from './CategoriesTags'
import { supabase } from '@/config/supabaseClient'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

// Define the category type
type Category = {
  id: string
  topic: string
  slug: string
  difficulty: string
  count: number
  isHot: boolean
}

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        const { data, error } = await supabase.from('categories').select('*')
        if (data) {
          setCategories(data)
        } else if (error) {
          setError(error.message)
        }
      } catch {
        setError('Failed to fetch categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[300px] sm:min-h-[400px] flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500 animate-spin mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-600 text-sm sm:text-lg">Loading categories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[300px] sm:min-h-[400px] flex items-center justify-center px-4">
        <div className="text-center p-6 sm:p-8 bg-red-50 rounded-2xl border border-red-200 max-w-sm sm:max-w-md">
          <div className="text-red-500 text-4xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
          <p className="text-red-600 text-sm sm:text-lg font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Explore our diverse collection of quizzes across various topics. 
            Each category is carefully curated to help you learn and grow.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, index) => (
            <Link 
              key={cat.slug} 
              href={`/quiz/${cat.slug}`}
              className="block animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CategoriesTags topic={cat.topic} count={cat.count} />
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && !loading && !error && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📚</div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">No categories available</h3>
            <p className="text-gray-500 text-sm sm:text-base">Check back later for new quiz categories!</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default CategoriesSection
