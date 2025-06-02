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

    // Get active collaborators (last seen within 2 minutes)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)

    const activeCollaborators = await db
      .collection("user_presence")
      .find({
        recipeId: new ObjectId(params.id),
        lastSeen: { $gte: twoMinutesAgo },
      })
      .toArray()

    return NextResponse.json({
      activeCollaborators: activeCollaborators.map((presence) => ({
        userId: presence.userId,
        userName: presence.userName,
        lastSeen: presence.lastSeen,
        isActive: true,
      })),
    })
  } catch (error) {
    console.error("Get presence error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()

    // Update user presence
    await db.collection("user_presence").updateOne(
      {
        recipeId: new ObjectId(params.id),
        userId: session.user.id,
      },
      {
        $set: {
          recipeId: new ObjectId(params.id),
          userId: session.user.id,
          userName: session.user.name || session.user.email,
          lastSeen: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update presence error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
