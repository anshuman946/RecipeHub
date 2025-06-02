import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const tag = searchParams.get("tag") || ""
    const sortBy = searchParams.get("sortBy") || "recent"

    const db = await getDatabase()

    // Build query
    const query: any = { isPublic: true }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    if (tag) {
      query.tags = tag
    }

    // Build sort
    let sort: any = { createdAt: -1 }
    switch (sortBy) {
      case "popular":
        sort = { likes: -1 }
        break
      case "collaborative":
        sort = { "collaborators.length": -1 }
        break
    }

    const skip = (page - 1) * limit

    const [recipes, total] = await Promise.all([
      db.collection("recipes").find(query).sort(sort).skip(skip).limit(limit).toArray(),
      db.collection("recipes").countDocuments(query),
    ])

    return NextResponse.json({
      recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get recipes error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const recipeData = await request.json()

    const { title, description, servings, tags, ingredients, steps, isPublic } = recipeData

    if (!title || !ingredients || !steps) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()

    const recipe = {
      title,
      description: description || "",
      servings: Number.parseInt(servings) || 1,
      tags: tags || [],
      ingredients,
      steps,
      authorId: session.user.id,
      author: session.user.name || session.user.email,
      collaborators: [],
      isPublic: isPublic !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      views: 0,
    }

    const result = await db.collection("recipes").insertOne(recipe)

    return NextResponse.json(
      {
        message: "Recipe created successfully",
        recipeId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create recipe error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
