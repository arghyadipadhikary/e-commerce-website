"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Upload, Wand2, Save } from "lucide-react"
import type { Product } from "@/types"

interface BulkDescriptionUpdaterProps {
  products: Product[]
  onUpdate: (updatedProducts: Product[]) => void
}

export function BulkDescriptionUpdater({ products, onUpdate }: BulkDescriptionUpdaterProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [updateType, setUpdateType] = useState<"append" | "prepend" | "replace">("append")
  const [updateText, setUpdateText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = Array.from(new Set(products.map((p) => p.category)))
  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory)

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id))
    }
  }

  const handleProductSelect = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleBulkUpdate = () => {
    const updatedProducts = products.map((product) => {
      if (!selectedProducts.includes(product.id)) return product

      let newDescription = product.description

      switch (updateType) {
        case "append":
          newDescription = `${product.description} ${updateText}`.trim()
          break
        case "prepend":
          newDescription = `${updateText} ${product.description}`.trim()
          break
        case "replace":
          newDescription = updateText
          break
      }

      return { ...product, description: newDescription }
    })

    onUpdate(updatedProducts)
    setSelectedProducts([])
    setUpdateText("")
  }

  const generateTemplateDescriptions = () => {
    const templates = {
      Electronics:
        "Cutting-edge technology meets premium design in this exceptional electronic device. Built for performance and reliability.",
      Clothing:
        "Crafted from premium materials with attention to detail, this clothing item combines style, comfort, and durability.",
      "Home & Garden":
        "Transform your living space with this carefully designed home and garden essential. Quality meets functionality.",
      Sports:
        "Engineered for performance and built to last, this sports equipment helps you achieve your fitness goals.",
      Beauty: "Discover the perfect blend of luxury and effectiveness in this premium beauty product.",
      Books: "Expand your knowledge and imagination with this carefully curated literary work.",
      Toys: "Safe, educational, and fun - this toy is designed to inspire creativity and learning.",
      Automotive: "Enhance your driving experience with this high-quality automotive accessory.",
    }

    const updatedProducts = products.map((product) => {
      if (!selectedProducts.includes(product.id)) return product

      const template = templates[product.category as keyof typeof templates] || templates["Electronics"]
      return {
        ...product,
        description: `${product.name} - ${template} Perfect for those who appreciate quality and innovation.`,
      }
    })

    onUpdate(updatedProducts)
    setSelectedProducts([])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Description Updater
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Filter by Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product Selection */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium">Select Products</label>
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedProducts.length === filteredProducts.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="max-h-60 overflow-y-auto border rounded-lg p-3 space-y-2">
            {filteredProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => handleProductSelect(product.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-gray-500 truncate">{product.description}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-2">
            {selectedProducts.length} of {filteredProducts.length} products selected
          </p>
        </div>

        {/* Update Options */}
        <div>
          <label className="text-sm font-medium mb-2 block">Update Type</label>
          <Select value={updateType} onValueChange={(value: "append" | "prepend" | "replace") => setUpdateType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="append">Append to existing description</SelectItem>
              <SelectItem value="prepend">Prepend to existing description</SelectItem>
              <SelectItem value="replace">Replace entire description</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Update Text */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            {updateType === "replace" ? "New Description" : "Text to Add"}
          </label>
          <Textarea
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            placeholder={
              updateType === "replace"
                ? "Enter the complete new description..."
                : "Enter text to add to descriptions..."
            }
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleBulkUpdate} disabled={selectedProducts.length === 0 || !updateText.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Update {selectedProducts.length} Products
          </Button>

          <Button variant="outline" onClick={generateTemplateDescriptions} disabled={selectedProducts.length === 0}>
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Templates
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
