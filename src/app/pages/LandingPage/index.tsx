import CategoriesSection from '@/components/CategoriesSection'
import ClearQuizButton from '@/components/ClearQuizButton'
import HomeBanner from '@/components/HomeBanner'
import React from 'react'

const  LandingPage = () => {
  return (
    <div>
      <HomeBanner />
      <CategoriesSection />
      <ClearQuizButton />
    </div>

  )
}

export default LandingPage