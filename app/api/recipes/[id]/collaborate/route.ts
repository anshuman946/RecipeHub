import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { sendCollaborationInvite } from "@/lib/email"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, message } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
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

    // Only author can add collaborators
    if (recipe.authorId !== session.user.id) {
      return NextResponse.json({ error: "Only the recipe author can invite collaborators" }, { status: 403 })
    }

    // Check if user exists
    const collaborator = await db.collection("users").findOne({
      email: email.toLowerCase(),
    })

    if (!collaborator) {
      return NextResponse.json({ error: "User not found. They need to register first." }, { status: 404 })
    }

    // Check if already a collaborator
    if (recipe.collaborators.some((collab: any) => collab.email === email.toLowerCase())) {
      return NextResponse.json({ error: "User is already a collaborator" }, { status: 400 })
    }

    // Create collaboration invitation
    const invitation = {
      recipeId: new ObjectId(params.id),
      invitedBy: session.user.id,
      invitedByName: session.user.name,
      invitedEmail: email.toLowerCase(),
      invitedName: collaborator.name,
      message: message || "",
      status: "pending", // pending, accepted, declined
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    }

    // Store invitation
    const invitationResult = await db.collection("invitations").insertOne(invitation)

    // Send email invitation
    try {
      await sendCollaborationInvite({
        to: email,
        recipeName: recipe.title,
        inviterName: session.user.name || session.user.email,
        message: message || "",
        invitationId: invitationResult.insertedId.toString(),
        recipeId: params.id,
      })
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
      // Continue even if email fails - user can still be added manually
    }

    return NextResponse.json({
      message: "Collaboration invitation sent successfully",
      invitationId: invitationResult.insertedId,
    })
  } catch (error) {
    console.error("Add collaborator error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Get collaboration invitations for a recipe
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

    const recipe = await db.collection("recipes").findOne({
      _id: new ObjectId(params.id),
    })

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Only author can view invitations
    if (recipe.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const invitations = await db
      .collection("invitations")
      .find({ recipeId: new ObjectId(params.id) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ invitations })
  } catch (error) {
    console.error("Get invitations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
