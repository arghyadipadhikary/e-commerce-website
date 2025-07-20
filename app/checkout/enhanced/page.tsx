"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShippingForm } from "@/components/shipping-form"
import { CreditCard, Lock, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripe"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

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

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const { items, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState<"shipping" | "payment">("shipping")

  const subtotal = getCartTotal()
  const shippingCost = shippingMethod?.price || 0
  const tax = (subtotal + shippingCost) * 0.08
  const total = subtotal + shippingCost + tax

  const handleShippingChange = (address: ShippingAddress, method: ShippingMethod) => {
    setShippingAddress(address)
    setShippingMethod(method)
  }

  const handleContinueToPayment = () => {
    if (!shippingAddress || !shippingMethod) {
      setError("Please complete shipping information")
      return
    }

    const isAddressComplete =
      shippingAddress.firstName &&
      shippingAddress.lastName &&
      shippingAddress.address &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.zipCode &&
      shippingAddress.phone

    if (!isAddressComplete) {
      setError("Please fill in all required shipping fields")
      return
    }

    setError("")
    setCurrentStep("payment")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !shippingAddress || !shippingMethod) {
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        throw new Error("Card element not found")
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            phone: shippingAddress.phone,
            address: {
              line1: shippingAddress.address,
              line2: shippingAddress.apartment || undefined,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.zipCode,
              country: "US",
            },
          },
        },
      })

      if (stripeError) {
        setError(stripeError.message || "Payment failed")
        return
      }

      if (paymentIntent.status === "succeeded") {
        // Create order in database
        const orderData = {
          userId: user?.id || "guest",
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image,
          })),
          subtotal,
          shippingCost,
          tax,
          total,
          status: "confirmed",
          paymentIntentId: paymentIntent.id,
          shippingAddress,
          shippingMethod,
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(
            Date.now() + Number.parseInt(shippingMethod.estimatedDays) * 24 * 60 * 60 * 1000,
          ).toISOString(),
        }

        const docRef = await addDoc(collection(db, "orders"), orderData)

        // Clear cart and redirect to confirmation
        clearCart()
        router.push(`/order-confirmation/${docRef.id}?payment_intent=${paymentIntent.id}`)
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError("An error occurred during payment. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div
            className={`flex items-center space-x-2 ${currentStep === "shipping" ? "text-purple-600" : "text-gray-400"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "shipping" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <span className="font-medium">Shipping</span>
          </div>
          <div className="w-16 h-px bg-gray-300"></div>
          <div
            className={`flex items-center space-x-2 ${currentStep === "payment" ? "text-purple-600" : "text-gray-400"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === "payment" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <span className="font-medium">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === "shipping" ? (
            <div>
              <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/cart">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Cart
                  </Link>
                </Button>
              </div>

              <ShippingForm
                onShippingChange={handleShippingChange}
                initialAddress={
                  user
                    ? {
                        firstName: user.name?.split(" ")[0] || "",
                        lastName: user.name?.split(" ").slice(1).join(" ") || "",
                        address: user.address?.street || "",
                        city: user.address?.city || "",
                        state: user.address?.state || "",
                        zipCode: user.address?.zipCode || "",
                        country: user.address?.country || "United States",
                        phone: user.phone || "",
                      }
                    : undefined
                }
              />

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="mt-6 flex justify-end">
                <Button onClick={handleContinueToPayment} size="lg">
                  Continue to Payment
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-6">
                <Button type="button" variant="ghost" size="sm" onClick={() => setCurrentStep("shipping")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Shipping
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#424770",
                            "::placeholder": {
                              color: "#aab7c4",
                            },
                          },
                        },
                      }}
                    />
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Lock className="h-4 w-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </CardContent>
              </Card>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="mt-6">
                <Button type="submit" size="lg" className="w-full" disabled={isProcessing || !stripe}>
                  {isProcessing ? "Processing..." : `Complete Order - $${total.toFixed(2)}`}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                      <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Shipping Address Summary */}
              {shippingAddress && (
                <div className="text-sm">
                  <h4 className="font-medium mb-2">Shipping to:</h4>
                  <p className="text-gray-600">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                    <br />
                    {shippingAddress.address}
                    <br />
                    {shippingAddress.apartment && `${shippingAddress.apartment}\n`}
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                  </p>
                </div>
              )}

              {/* Shipping Method Summary */}
              {shippingMethod && (
                <div className="text-sm">
                  <h4 className="font-medium mb-2">Shipping Method:</h4>
                  <p className="text-gray-600">
                    {shippingMethod.name} - {shippingMethod.description}
                  </p>
                </div>
              )}

              <Separator />

              {/* Order Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function EnhancedCheckoutPage() {
  const { items, getCartTotal } = useCart()
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
      return
    }

    // Create payment intent
    const createPaymentIntent = async () => {
      try {
        const total = getCartTotal() * 1.08 // Include estimated tax
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: total,
            currency: "usd",
            metadata: {
              orderType: "ecommerce",
            },
          }),
        })

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error("Error creating payment intent:", error)
      } finally {
        setLoading(false)
      }
    }

    createPaymentIntent()
  }, [items, getCartTotal, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading checkout...</div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to load checkout</h1>
          <p className="text-gray-600 mb-6">Please try again later</p>
          <Button onClick={() => router.push("/cart")}>Return to Cart</Button>
        </div>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  )
}
