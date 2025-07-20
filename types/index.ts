export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
  featured: boolean
  discount?: number
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: string
}

export interface Order {
  id: string
  userId: string
  items: Array<{
    productId: string
    quantity: number
    price: number
    name?: string
  }>
  total: number
  subtotal: number
  tax: number
  shipping: number
  status: "pending" | "processing" | "shipped" | "delivered"
  paymentIntentId?: string
  createdAt: string
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  guestEmail?: string
}
