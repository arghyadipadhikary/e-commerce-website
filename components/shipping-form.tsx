"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, MapPin, Clock } from "lucide-react"

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
  icon: React.ReactNode
}

interface ShippingFormProps {
  onShippingChange: (address: ShippingAddress, method: ShippingMethod) => void
  initialAddress?: Partial<ShippingAddress>
}

const shippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "5-7 business days",
    price: 0,
    estimatedDays: "5-7 days",
    icon: <Truck className="h-4 w-4" />,
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "2-3 business days",
    price: 9.99,
    estimatedDays: "2-3 days",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    description: "Next business day",
    price: 24.99,
    estimatedDays: "1 day",
    icon: <MapPin className="h-4 w-4" />,
  },
]

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

export function ShippingForm({ onShippingChange, initialAddress }: ShippingFormProps) {
  const [address, setAddress] = useState<ShippingAddress>({
    firstName: initialAddress?.firstName || "",
    lastName: initialAddress?.lastName || "",
    company: initialAddress?.company || "",
    address: initialAddress?.address || "",
    apartment: initialAddress?.apartment || "",
    city: initialAddress?.city || "",
    state: initialAddress?.state || "",
    zipCode: initialAddress?.zipCode || "",
    country: initialAddress?.country || "United States",
    phone: initialAddress?.phone || "",
  })

  const [selectedMethod, setSelectedMethod] = useState<ShippingMethod>(shippingMethods[0])
  const [saveAddress, setSaveAddress] = useState(false)
  const [sameAsBilling, setSameAsBilling] = useState(true)

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    const newAddress = { ...address, [field]: value }
    setAddress(newAddress)
    onShippingChange(newAddress, selectedMethod)
  }

  const handleMethodChange = (method: ShippingMethod) => {
    setSelectedMethod(method)
    onShippingChange(address, method)
  }

  const isAddressComplete = () => {
    return (
      address.firstName &&
      address.lastName &&
      address.address &&
      address.city &&
      address.state &&
      address.zipCode &&
      address.phone
    )
  }

  return (
    <div className="space-y-6">
      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={address.firstName}
                onChange={(e) => handleAddressChange("firstName", e.target.value)}
                required
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={address.lastName}
                onChange={(e) => handleAddressChange("lastName", e.target.value)}
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Company (Optional) */}
          <div>
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              value={address.company}
              onChange={(e) => handleAddressChange("company", e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={address.address}
              onChange={(e) => handleAddressChange("address", e.target.value)}
              required
              placeholder="Enter street address"
            />
          </div>

          {/* Apartment/Suite */}
          <div>
            <Label htmlFor="apartment">Apartment, Suite, etc. (Optional)</Label>
            <Input
              id="apartment"
              value={address.apartment}
              onChange={(e) => handleAddressChange("apartment", e.target.value)}
              placeholder="Apt, Suite, Unit, Building, Floor, etc."
            />
          </div>

          {/* City, State, ZIP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                required
                placeholder="Enter city"
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Select value={address.state} onValueChange={(value) => handleAddressChange("state", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={address.zipCode}
                onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                required
                placeholder="Enter ZIP code"
                pattern="[0-9]{5}(-[0-9]{4})?"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={address.phone}
              onChange={(e) => handleAddressChange("phone", e.target.value)}
              required
              placeholder="Enter phone number"
            />
          </div>

          {/* Options */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox id="saveAddress" checked={saveAddress} onCheckedChange={setSaveAddress} />
              <Label htmlFor="saveAddress" className="text-sm">
                Save this address for future orders
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="sameAsBilling" checked={sameAsBilling} onCheckedChange={setSameAsBilling} />
              <Label htmlFor="sameAsBilling" className="text-sm">
                Billing address is the same as shipping address
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipping Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shippingMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod.id === method.id
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleMethodChange(method)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        selectedMethod.id === method.id ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {method.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{method.name}</h4>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{method.price === 0 ? "FREE" : `$${method.price.toFixed(2)}`}</p>
                    <p className="text-sm text-gray-600">{method.estimatedDays}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Estimate */}
          {isAddressComplete() && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  Estimated delivery:{" "}
                  {new Date(
                    Date.now() + Number.parseInt(selectedMethod.estimatedDays) * 24 * 60 * 60 * 1000,
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
