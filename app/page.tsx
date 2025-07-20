"use client"

import { Suspense } from "react"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { CategorySection } from "@/components/category-section"
import { NewsletterSection } from "@/components/newsletter-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <FeaturedProducts />
      </Suspense>
      <CategorySection />
      <NewsletterSection />
    </div>
  )
}
