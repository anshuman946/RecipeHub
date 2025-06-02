import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
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

    // Increment view count
    await db.collection("recipes").updateOne({ _id: new ObjectId(params.id) }, { $inc: { views: 1 } })

    return NextResponse.json(recipe)
  } catch (error) {
    console.error("Get recipe error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if user can edit (author or collaborator)
    const canEdit = recipe.authorId === session.user.id || recipe.collaborators.includes(session.user.email)

    if (!canEdit) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updateData = await request.json()

    const result = await db.collection("recipes").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Recipe updated successfully" })
  } catch (error) {
    console.error("Update recipe error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Only author can delete
    if (recipe.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.collection("recipes").deleteOne({
      _id: new ObjectId(params.id),
    })

    return NextResponse.json({ message: "Recipe deleted successfully" })
  } catch (error) {
    console.error("Delete recipe error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
