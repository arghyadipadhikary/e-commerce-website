"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product } from "@/types"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, "products"))
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]

      setProducts(productsData)
      setError(null)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const productRef = doc(db, "products", productId)
      await updateDoc(productRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      })

      // Update local state
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...updates } : p)))

      return true
    } catch (err) {
      console.error("Error updating product:", err)
      setError("Failed to update product")
      return false
    }
  }

  const updateProductDescription = async (productId: string, description: string) => {
    return updateProduct(productId, { description })
  }

  const bulkUpdateDescriptions = async (updates: Array<{ id: string; description: string }>) => {
    try {
      const promises = updates.map(({ id, description }) =>
        updateDoc(doc(db, "products", id), {
          description,
          updatedAt: new Date().toISOString(),
        }),
      )

      await Promise.all(promises)

      // Update local state
      setProducts((prev) =>
        prev.map((product) => {
          const update = updates.find((u) => u.id === product.id)
          return update ? { ...product, description: update.description } : product
        }),
      )

      return true
    } catch (err) {
      console.error("Error bulk updating descriptions:", err)
      setError("Failed to bulk update descriptions")
      return false
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    fetchProducts,
    updateProduct,
    updateProductDescription,
    bulkUpdateDescriptions,
  }
}
