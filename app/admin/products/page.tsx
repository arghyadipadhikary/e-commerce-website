"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash2, Plus, Save, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { products as initialProducts } from "@/lib/mock-data"
import type { Product } from "@/types"
import Image from "next/image"

export default function AdminProductsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Check if user is admin
  const isAdmin = user?.email === "admin@shophub.com"

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/")
    }
  }, [user, loading, isAdmin, router])

  const categories = Array.from(new Set(products.map((p) => p.category)))
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product })
    setIsDialogOpen(true)
  }

  const handleSaveProduct = () => {
    if (!editingProduct) return

    setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? editingProduct : p)))

    // In a real app, you'd save to database here
    console.log("Saving product:", editingProduct)

    setIsDialogOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      // In a real app, you'd delete from database here
    }
  }

  const handleCreateProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "New Product",
      description: "Enter product description here...",
      price: 0,
      image: "/placeholder.svg?height=300&width=300",
      category: "Electronics",
      rating: 0,
      reviews: 0,
      inStock: true,
      featured: false,
      createdAt: new Date().toISOString(),
    }
    setEditingProduct(newProduct)
    setIsDialogOpen(true)
  }

  const handleBulkDescriptionUpdate = () => {
    const updatedProducts = products.map((product) => ({
      ...product,
      description: `${product.description} - Updated with enhanced features and premium quality materials.`,
    }))
    setProducts(updatedProducts)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog and descriptions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleBulkDescriptionUpdate} variant="outline">
            Bulk Update Descriptions
          </Button>
          <Button onClick={handleCreateProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
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
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant={product.inStock ? "default" : "destructive"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-purple-600">${product.price.toFixed(2)}</span>
                <div className="text-sm text-gray-500">
                  ⭐ {product.rating} ({product.reviews})
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct?.id && products.find((p) => p.id === editingProduct.id)
                ? "Edit Product"
                : "Create Product"}
            </DialogTitle>
          </DialogHeader>

          {editingProduct && (
            <div className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={editingProduct.category}
                        onValueChange={(value) =>
                          setEditingProduct({
                            ...editingProduct,
                            category: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        step="0.01"
                        value={editingProduct.originalPrice || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            originalPrice: Number.parseFloat(e.target.value) || undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="description" className="space-y-4">
                  <div>
                    <Label htmlFor="description">Product Description</Label>
                    <Textarea
                      id="description"
                      rows={8}
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter detailed product description..."
                    />
                    <p className="text-sm text-gray-500 mt-1">Characters: {editingProduct.description.length}</p>
                  </div>

                  <div>
                    <Label>Description Preview</Label>
                    <div className="p-3 border rounded-md bg-gray-50 text-sm">
                      {editingProduct.description || "No description provided"}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={editingProduct.rating}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            rating: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="reviews">Reviews Count</Label>
                      <Input
                        id="reviews"
                        type="number"
                        min="0"
                        value={editingProduct.reviews}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            reviews: Number.parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inStock"
                        checked={editingProduct.inStock}
                        onCheckedChange={(checked) =>
                          setEditingProduct({
                            ...editingProduct,
                            inStock: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="inStock">In Stock</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={editingProduct.featured}
                        onCheckedChange={(checked) =>
                          setEditingProduct({
                            ...editingProduct,
                            featured: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={editingProduct.image}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          image: e.target.value,
                        })
                      }
                      placeholder="/placeholder.svg?height=300&width=300"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveProduct}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Product
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
