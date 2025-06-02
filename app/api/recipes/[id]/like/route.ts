import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 })
    }

    const recipe = await db.collection("recipes").findOne({
      _id: new ObjectId(params.id),
    })

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Check if user already liked this recipe
    const existingLike = await db.collection("likes").findOne({
      recipeId: new ObjectId(params.id),
      userId: session.user.id,
    })

    if (existingLike) {
      // Unlike
      await db.collection("likes").deleteOne({
        recipeId: new ObjectId(params.id),
        userId: session.user.id,
      })

      await db.collection("recipes").updateOne({ _id: new ObjectId(params.id) }, { $inc: { likes: -1 } })

      return NextResponse.json({ message: "Recipe unliked", liked: false })
    } else {
      // Like
      await db.collection("likes").insertOne({
        recipeId: new ObjectId(params.id),
        userId: session.user.id,
        createdAt: new Date(),
      })

      await db.collection("recipes").updateOne({ _id: new ObjectId(params.id) }, { $inc: { likes: 1 } })

      return NextResponse.json({ message: "Recipe liked", liked: true })
    }
  } catch (error) {
    console.error("Like recipe error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
