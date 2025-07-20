"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Smartphone, Shirt, Home, Dumbbell, Book, Sparkles, Car, Baby, Search, Grid3X3, List } from "lucide-react"
import Link from "next/link"
import { products } from "@/lib/mock-data"
import { useLanguage } from "@/contexts/language-context"
import { ProductCard } from "@/components/product-card"

const categoryIcons = {
  Electronics: Smartphone,
  Clothing: Shirt,
  "Home & Garden": Home,
  Sports: Dumbbell,
  Books: Book,
  Beauty: Sparkles,
  Automotive: Car,
  Toys: Baby,
}

const categoryDescriptions = {
  Electronics: "Latest gadgets, smartphones, laptops, and tech accessories",
  Clothing: "Fashion for men, women, and children - from casual to formal wear",
  "Home & Garden": "Everything for your home, garden, and outdoor living spaces",
  Sports: "Fitness equipment, outdoor gear, and sporting goods",
  Books: "Educational, fiction, non-fiction, and digital books",
  Beauty: "Skincare, cosmetics, fragrances, and personal care products",
  Automotive: "Car accessories, tools, and automotive maintenance products",
  Toys: "Educational toys, games, and entertainment for all ages",
}

export default function CategoriesPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Get all unique categories from products
  const allCategories = Array.from(new Set(products.map((product) => product.category)))

  // Calculate product counts per category
  const categoryStats = allCategories.map((category) => ({
    name: category,
    count: products.filter((product) => product.category === category).length,
    icon: categoryIcons[category as keyof typeof categoryIcons] || Smartphone,
    description:
      categoryDescriptions[category as keyof typeof categoryDescriptions] ||
      "Discover amazing products in this category",
  }))

  // Filter categories based on search
  const filteredCategories = categoryStats.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get products for selected category
  const categoryProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory).slice(0, 8)
    : []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("nav.categories")}</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore our wide range of product categories to find exactly what you're looking for
        </p>
      </div>

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories Grid/List */}
      <div
        className={`mb-12 ${
          viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
        }`}
      >
        {filteredCategories.map((category) => {
          const Icon = category.icon
          return (
            <Card
              key={category.name}
              className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${
                selectedCategory === category.name ? "ring-2 ring-purple-500" : ""
              } ${viewMode === "list" ? "hover:scale-[1.02]" : "hover:scale-105"}`}
              onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
            >
              <CardContent className={`p-6 ${viewMode === "list" ? "flex items-center space-x-6" : "text-center"}`}>
                <div className={`${viewMode === "list" ? "flex-shrink-0" : "mb-4"}`}>
                  <div
                    className={`${
                      viewMode === "list" ? "w-16 h-16" : "w-20 h-20 mx-auto"
                    } bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors`}
                  >
                    <Icon
                      className={`${
                        viewMode === "list" ? "h-8 w-8" : "h-10 w-10"
                      } text-purple-600 group-hover:scale-110 transition-transform duration-300`}
                    />
                  </div>
                </div>

                <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                  <div
                    className={`flex items-center ${
                      viewMode === "list" ? "justify-between mb-2" : "justify-center mb-2"
                    }`}
                  >
                    <h3 className={`${viewMode === "list" ? "text-xl" : "text-lg"} font-semibold`}>{category.name}</h3>
                    <Badge variant="secondary" className="ml-2">
                      {category.count} items
                    </Badge>
                  </div>

                  <p
                    className={`text-gray-600 dark:text-gray-300 ${viewMode === "list" ? "text-base" : "text-sm"} mb-4`}
                  >
                    {category.description}
                  </p>

                  <div className={`flex gap-2 ${viewMode === "list" ? "justify-start" : "justify-center"}`}>
                    <Button
                      asChild
                      size="sm"
                      className="group-hover:bg-purple-600 group-hover:text-white transition-colors"
                    >
                      <Link href={`/shop?category=${encodeURIComponent(category.name)}`}>Browse {category.name}</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedCategory(selectedCategory === category.name ? null : category.name)
                      }}
                    >
                      {selectedCategory === category.name ? "Hide" : "Preview"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Category Products Preview */}
      {selectedCategory && categoryProducts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured {selectedCategory} Products</h2>
            <Button asChild variant="outline">
              <Link href={`/shop?category=${encodeURIComponent(selectedCategory)}`}>View All {selectedCategory}</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No categories found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Try adjusting your search terms</p>
          <Button onClick={() => setSearchQuery("")} variant="outline">
            Clear Search
          </Button>
        </div>
      )}

      {/* Popular Categories Section */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categoryStats.slice(0, 8).map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                href={`/shop?category=${encodeURIComponent(category.name)}`}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors group"
              >
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
                  <Icon className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-center">{category.name}</span>
                <span className="text-xs text-gray-500">{category.count} items</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
