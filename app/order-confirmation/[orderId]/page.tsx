"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Truck, Mail, MapPin, Calendar, Download, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useSearchParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface OrderItem {
  productId: string
  quantity: number
  price: number
  name: string
  image?: string
}

interface ShippingAddress {
  firstName: string
  lastName: string
  company?: string
  address: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: string
  paymentIntentId: string
  shippingAddress: ShippingAddress
  shippingMethod: ShippingMethod
  createdAt: string
  estimatedDelivery: string
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.orderId as string
  const paymentIntentId = searchParams.get("payment_intent")

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDoc = await getDoc(doc(db, "orders", orderId))

        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() } as Order)
        } else {
          setError("Order not found")
        }
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const handleDownloadReceipt = () => {
    // Generate and download receipt
    const receiptContent = `
      ORDER CONFIRMATION
      ==================
      
      Order #: ${order?.id.slice(-8).toUpperCase()}
      Date: ${order ? new Date(order.createdAt).toLocaleDateString() : ""}
      
      ITEMS:
      ${order?.items.map((item) => `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`).join("\n")}
      
      SHIPPING ADDRESS:
      ${order?.shippingAddress.firstName} ${order?.shippingAddress.lastName}
      ${order?.shippingAddress.address}
      ${order?.shippingAddress.apartment ? order.shippingAddress.apartment + "\n" : ""}${order?.shippingAddress.city}, ${order?.shippingAddress.state} ${order?.shippingAddress.zipCode}
      
      TOTALS:
      Subtotal: $${order?.subtotal.toFixed(2)}
      Shipping: $${order?.shippingCost.toFixed(2)}
      Tax: $${order?.tax.toFixed(2)}
      Total: $${order?.total.toFixed(2)}
    `

    const blob = new Blob([receiptContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `order-${order?.id.slice(-8)}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleShareOrder = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My ShopHub Order",
          text: `I just placed an order on ShopHub! Order #${order?.id.slice(-8).toUpperCase()}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Order link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The order you're looking for doesn't exist."}</p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 text-lg">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Number */}
          <Card className="inline-block">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="text-xl font-bold text-purple-600">#{order.id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                {paymentIntentId && (
                  <div>
                    <p className="text-sm text-gray-600">Payment ID</p>
                    <p className="font-mono text-sm">{paymentIntentId.slice(-8)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button onClick={handleDownloadReceipt} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          <Button onClick={handleShareOrder} variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Order
          </Button>
          <Button asChild>
            <Link href="/orders">View All Orders</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Delivery Address
                  </h4>
                  <div className="text-gray-600 ml-6">
                    <p>
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    {order.shippingAddress.company && <p>{order.shippingAddress.company}</p>}
                    <p>{order.shippingAddress.address}</p>
                    {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    <p>Phone: {order.shippingAddress.phone}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Shipping Method
                  </h4>
                  <div className="ml-6">
                    <p className="font-medium">{order.shippingMethod.name}</p>
                    <p className="text-sm text-gray-600">{order.shippingMethod.description}</p>
                    <p className="text-sm text-gray-600">
                      Cost: {order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Next Steps */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shippingCost === 0 ? "Free" : `$${order.shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="pt-2">
                  <Badge className="w-full justify-center bg-green-100 text-green-800 hover:bg-green-100">
                    Payment Confirmed
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* What's Next */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Confirmation Email</h4>
                    <p className="text-sm text-gray-600">Order details sent to your email</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Order Processing</h4>
                    <p className="text-sm text-gray-600">We're preparing your items for shipment</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Truck className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Tracking Information</h4>
                    <p className="text-sm text-gray-600">You'll receive tracking details once shipped</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Continue Shopping</h3>
                <p className="text-sm text-gray-600 mb-4">Discover more amazing products</p>
                <Button asChild className="w-full">
                  <Link href="/shop">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">If you have any questions about your order, we're here to help.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/faq">View FAQ</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/orders">Track Orders</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
