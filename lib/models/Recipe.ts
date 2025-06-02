import type { ObjectId } from "mongodb"

export interface Ingredient {
  id: string
  name: string
  quantity: number
  unit: string
}

export interface Step {
  id: string
  instruction: string
  timer?: number
}

export interface Recipe {
  _id?: ObjectId
  title: string
  description: string
  servings: number
  tags: string[]
  ingredients: Ingredient[]
  steps: Step[]
  authorId: string
  author: string
  collaborators: string[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  likes: number
  views: number
}

export interface RecipeDocument extends Recipe {
  _id: ObjectId
}
