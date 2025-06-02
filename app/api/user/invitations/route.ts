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

    const db = await getDatabase()

    // Get pending invitations for the current user
    const invitations = await db
      .collection("invitations")
      .aggregate([
        {
          $match: {
            invitedEmail: session.user.email?.toLowerCase(),
            status: "pending",
            expiresAt: { $gt: new Date() },
          },
        },
        {
          $lookup: {
            from: "recipes",
            localField: "recipeId",
            foreignField: "_id",
            as: "recipe",
          },
        },
        {
          $unwind: "$recipe",
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      .toArray()

    return NextResponse.json({ invitations })
  } catch (error) {
    console.error("Get user invitations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
