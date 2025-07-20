"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const paymentIntentId = searchParams.get("payment_intent")
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: "",
    email: "",
    estimatedDelivery: "",
  })

  useEffect(() => {
    // Generate order details
    const orderNumber = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase()
    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()

    setOrderDetails({
      orderNumber,
      email: "customer@example.com", // This would come from the actual order
      estimatedDelivery,
    })
  }, [paymentIntentId])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Confirmation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Order Number:</span>
              <span className="text-purple-600 font-mono">{orderDetails.orderNumber}</span>
            </div>
            {paymentIntentId && (
              <div className="flex justify-between items-center">
                <span className="font-medium">Payment ID:</span>
                <span className="text-gray-600 font-mono text-sm">{paymentIntentId.slice(-8)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="font-medium">Estimated Delivery:</span>
              <span>{orderDetails.estimatedDelivery}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Shipping Method:</span>
              <span>Standard Shipping (Free)</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Confirmation Email</h3>
              <p className="text-sm text-gray-600">Order details sent to your email</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Order Processing</h3>
              <p className="text-sm text-gray-600">We're preparing your items</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Track Your Order</h3>
              <p className="text-sm text-gray-600">Tracking info coming soon</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/profile?tab=orders">View Order Status</Link>
          </Button>
          <div>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">What's Next?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• You'll receive an email confirmation shortly</li>
            <li>• We'll send tracking information once your order ships</li>
            <li>• Questions? Contact our support team anytime</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
