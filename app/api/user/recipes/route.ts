import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "my" // 'my' or 'collaborative'

    const db = await getDatabase()

    let query: any

    if (type === "collaborative") {
      query = {
        collaborators: session.user.email,
        authorId: { $ne: session.user.id },
      }
    } else {
      query = { authorId: session.user.id }
    }

    const recipes = await db.collection("recipes").find(query).sort({ updatedAt: -1 }).toArray()

    return NextResponse.json({ recipes })
  } catch (error) {
    console.error("Get user recipes error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
