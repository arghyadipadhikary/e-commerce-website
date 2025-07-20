"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Shirt, Home, Dumbbell, Book, Sparkles } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

const categories = [
  {
    name: "Electronics",
    icon: Smartphone,
    description: "Latest gadgets and tech",
    href: "/shop?category=Electronics",
  },
  {
    name: "Clothing",
    icon: Shirt,
    description: "Fashion for everyone",
    href: "/shop?category=Clothing",
  },
  {
    name: "Home & Garden",
    icon: Home,
    description: "Everything for your home",
    href: "/shop?category=Home%20%26%20Garden",
  },
  {
    name: "Sports",
    icon: Dumbbell,
    description: "Fitness and outdoor gear",
    href: "/shop?category=Sports",
  },
  {
    name: "Books",
    icon: Book,
    description: "Knowledge and entertainment",
    href: "/shop?category=Books",
  },
  {
    name: "Beauty",
    icon: Sparkles,
    description: "Skincare and cosmetics",
    href: "/shop?category=Beauty",
  },
]

export function CategorySection() {
  const { t } = useLanguage()

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t("home.categories.title")}</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            {t("home.categories.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.name} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="mb-3 sm:mb-4">
                    <Icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                    {category.description}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="group-hover:bg-purple-600 group-hover:text-white transition-colors bg-transparent w-full sm:w-auto"
                  >
                    <Link href={category.href}>Browse {category.name}</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
