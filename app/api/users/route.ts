import { NextResponse } from "next/server"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function GET() {
  try {
    const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(usersQuery)

    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
