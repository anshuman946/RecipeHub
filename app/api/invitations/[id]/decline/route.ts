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
      return NextResponse.json({ error: "Invalid invitation ID" }, { status: 400 })
    }

    const invitation = await db.collection("invitations").findOne({
      _id: new ObjectId(params.id),
    })

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    // Check if invitation is for the current user
    if (invitation.invitedEmail !== session.user.email?.toLowerCase()) {
      return NextResponse.json({ error: "This invitation is not for you" }, { status: 403 })
    }

    if (invitation.status !== "pending") {
      return NextResponse.json({ error: "Invitation has already been responded to" }, { status: 400 })
    }

    // Update invitation status
    await db.collection("invitations").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          status: "declined",
          respondedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Invitation declined" })
  } catch (error) {
    console.error("Decline invitation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
