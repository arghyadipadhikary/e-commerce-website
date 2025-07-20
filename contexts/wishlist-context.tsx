"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import type { Product } from "@/types"

interface WishlistContextType {
  items: Product[]
  addToWishlist: (product: Product) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => Promise<void>
  loading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Load wishlist from Firebase or localStorage
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        // Load from Firebase for authenticated users
        try {
          const wishlistDoc = await getDoc(doc(db, "wishlists", user.id))
          if (wishlistDoc.exists()) {
            setItems(wishlistDoc.data().items || [])
          }
        } catch (error) {
          console.error("Error loading wishlist from Firebase:", error)
        }
      } else {
        // Load from localStorage for guests
        const savedWishlist = localStorage.getItem("wishlist")
        if (savedWishlist) {
          setItems(JSON.parse(savedWishlist))
        }
      }
      setLoading(false)
    }

    loadWishlist()
  }, [user])

  // Save to Firebase or localStorage when items change
  useEffect(() => {
    if (loading) return

    const saveWishlist = async () => {
      if (user) {
        // Save to Firebase for authenticated users
        try {
          await setDoc(doc(db, "wishlists", user.id), { items }, { merge: true })
        } catch (error) {
          console.error("Error saving wishlist to Firebase:", error)
        }
      } else {
        // Save to localStorage for guests
        localStorage.setItem("wishlist", JSON.stringify(items))
      }
    }

    saveWishlist()
  }, [items, user, loading])

  const addToWishlist = async (product: Product) => {
    setItems((currentItems) => {
      if (!currentItems.find((item) => item.id === product.id)) {
        return [...currentItems, product]
      }
      return currentItems
    })
  }

  const removeFromWishlist = async (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId))
  }

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId)
  }

  const clearWishlist = async () => {
    setItems([])
    if (user) {
      try {
        await deleteDoc(doc(db, "wishlists", user.id))
      } catch (error) {
        console.error("Error clearing wishlist from Firebase:", error)
      }
    } else {
      localStorage.removeItem("wishlist")
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
