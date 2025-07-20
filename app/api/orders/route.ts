import { NextResponse } from "next/server"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET() {
  try {
    const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(ordersQuery)

    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
