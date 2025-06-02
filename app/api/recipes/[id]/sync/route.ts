import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 })
    }

    // Get recipe with recent activity
    const recipe = await db.collection("recipes").findOne({
      _id: new ObjectId(params.id),
    })

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Check if user has access (author, collaborator, or public recipe)
    const hasAccess =
      recipe.isPublic ||
      recipe.authorId === session.user.id ||
      recipe.collaborators.some((collab: any) => collab.email === session.user.email)

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get recent edits/activity for this recipe
    const recentActivity = await db
      .collection("recipe_activity")
      .find({ recipeId: new ObjectId(params.id) })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray()

    // Get current collaborators with their last activity
    const collaboratorActivity = await db
      .collection("recipe_activity")
      .aggregate([
        { $match: { recipeId: new ObjectId(params.id) } },
        { $sort: { timestamp: -1 } },
        {
          $group: {
            _id: "$userId",
            lastActivity: { $first: "$timestamp" },
            lastAction: { $first: "$action" },
            userName: { $first: "$userName" },
          },
        },
      ])
      .toArray()

    return NextResponse.json({
      recipe,
      recentActivity,
      collaboratorActivity,
      syncTimestamp: new Date(),
    })
  } catch (error) {
    console.error("Sync recipe error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Log activity when recipe is updated
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, details } = await request.json()

    const db = await getDatabase()

    // Log the activity
    await db.collection("recipe_activity").insertOne({
      recipeId: new ObjectId(params.id),
      userId: session.user.id,
      userName: session.user.name || session.user.email,
      action,
      details,
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Log activity error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
