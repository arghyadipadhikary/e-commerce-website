"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, Edit, Eye, Wand2 } from "lucide-react"

interface ProductDescriptionEditorProps {
  productId: string
  currentDescription: string
  productName: string
  onSave: (description: string) => void
}

export function ProductDescriptionEditor({
  productId,
  currentDescription,
  productName,
  onSave,
}: ProductDescriptionEditorProps) {
  const [description, setDescription] = useState(currentDescription)
  const [isEditing, setIsEditing] = useState(false)
  const [isPreview, setIsPreview] = useState(false)

  const handleSave = () => {
    onSave(description)
    setIsEditing(false)
  }

  const generateAIDescription = () => {
    // Simulate AI-generated description
    const templates = [
      `Discover the exceptional quality of ${productName}. Crafted with premium materials and designed for modern lifestyles, this product combines functionality with style. Perfect for those who appreciate quality and innovation.`,
      `Experience the difference with ${productName}. This carefully designed product offers superior performance and reliability. Whether for personal use or as a gift, it delivers outstanding value and satisfaction.`,
      `Elevate your experience with ${productName}. Featuring cutting-edge design and premium construction, this product is built to exceed expectations. Ideal for discerning customers who demand the best.`,
    ]

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
    setDescription(randomTemplate)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Product Description
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsPreview(!isPreview)}>
              <Eye className="h-4 w-4 mr-1" />
              {isPreview ? "Edit" : "Preview"}
            </Button>
            {isEditing && (
              <Button variant="outline" size="sm" onClick={generateAIDescription}>
                <Wand2 className="h-4 w-4 mr-1" />
                AI Generate
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPreview ? (
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
            <h4 className="font-semibold mb-2">{productName}</h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {description || "No description provided"}
            </p>
            <div className="mt-3 flex gap-2">
              <Badge variant="outline">{description.length} characters</Badge>
              <Badge variant="outline">{description.split(" ").length} words</Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description..."
              rows={6}
              disabled={!isEditing}
              className={!isEditing ? "bg-gray-50 dark:bg-gray-900" : ""}
            />
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>
                {description.length} characters • {description.split(" ").length} words
              </span>
              <div className="flex gap-2">
                {description.length > 500 && <Badge variant="destructive">Too long</Badge>}
                {description.length < 50 && description.length > 0 && <Badge variant="secondary">Too short</Badge>}
                {description.length >= 50 && description.length <= 500 && <Badge variant="default">Good length</Badge>}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setDescription(currentDescription)
                  setIsEditing(false)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Description
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
