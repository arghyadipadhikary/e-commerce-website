"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Download, FileText } from "lucide-react"
import type { Product } from "@/types"

interface CSVProductManagerProps {
  products: Product[]
  onUpdate: (products: Product[]) => void
}

export function CSVProductManager({ products, onUpdate }: CSVProductManagerProps) {
  const [importing, setImporting] = useState(false)

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Description", "Price", "Category", "In Stock"]
    const csvContent = [
      headers.join(","),
      ...products.map((product) =>
        [
          product.id,
          `"${product.name.replace(/"/g, '""')}"`,
          `"${product.description.replace(/"/g, '""')}"`,
          product.price,
          product.category,
          product.inStock,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "products.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const lines = csv.split("\n")
        const headers = lines[0].split(",")

        const updatedProducts = products.map((product) => {
          const productLine = lines.find((line) => line.startsWith(product.id))
          if (!productLine) return product

          const values = productLine.split(",")
          const descriptionIndex = headers.findIndex((h) => h.toLowerCase().includes("description"))

          if (descriptionIndex !== -1 && values[descriptionIndex]) {
            return {
              ...product,
              description: values[descriptionIndex].replace(/^"|"$/g, "").replace(/""/g, '"'),
            }
          }

          return product
        })

        onUpdate(updatedProducts)
      } catch (error) {
        console.error("Error parsing CSV:", error)
      } finally {
        setImporting(false)
      }
    }

    reader.readAsText(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          CSV Import/Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>

          <div className="relative">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileImport}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={importing}
            />
            <Button disabled={importing}>
              <Upload className="h-4 w-4 mr-2" />
              {importing ? "Importing..." : "Import CSV"}
            </Button>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Export products to CSV, edit descriptions in your spreadsheet app, then import back.
        </p>
      </CardContent>
    </Card>
  )
}
