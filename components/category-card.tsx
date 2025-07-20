"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface CategoryCardProps {
  name: string
  description: string
  count: number
  icon: LucideIcon
  featured?: boolean
  viewMode?: "grid" | "list"
  isSelected?: boolean
  onSelect?: () => void
}

export function CategoryCard({
  name,
  description,
  count,
  icon: Icon,
  featured = false,
  viewMode = "grid",
  isSelected = false,
  onSelect,
}: CategoryCardProps) {
  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${
        isSelected ? "ring-2 ring-purple-500" : ""
      } ${viewMode === "list" ? "hover:scale-[1.02]" : "hover:scale-105"}`}
      onClick={onSelect}
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
          <div className={`flex items-center ${viewMode === "list" ? "justify-between mb-2" : "justify-center mb-2"}`}>
            <h3 className={`${viewMode === "list" ? "text-xl" : "text-lg"} font-semibold`}>{name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{count} items</Badge>
              {featured && <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">Popular</Badge>}
            </div>
          </div>

          <p className={`text-gray-600 dark:text-gray-300 ${viewMode === "list" ? "text-base" : "text-sm"} mb-4`}>
            {description}
          </p>

          <div className={`flex gap-2 ${viewMode === "list" ? "justify-start" : "justify-center"}`}>
            <Button asChild size="sm" className="group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Link href={`/shop?category=${encodeURIComponent(name)}`}>Browse {name}</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onSelect?.()
              }}
            >
              {isSelected ? "Hide" : "Preview"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

