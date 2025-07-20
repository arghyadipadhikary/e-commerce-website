import { type NextRequest, NextResponse } from "next/server"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updates = await request.json()

    // Update product in Firestore
    const productRef = doc(db, "products", id)
    await updateDoc(productRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })

    // Get updated product
    const updatedDoc = await getDoc(productRef)
    const updatedProduct = { id: updatedDoc.id, ...updatedDoc.data() }

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const productDoc = await getDoc(doc(db, "products", id))

    if (!productDoc.exists()) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const product = { id: productDoc.id, ...productDoc.data() }
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
