"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, X, Clock, ArrowLeft } from "lucide-react"
import { useSession } from "next-auth/react"

interface Ingredient {
  id: string
  name: string
  quantity: number
  unit: string
}

interface Step {
  id: string
  instruction: string
  timer?: number
}

export default function NewRecipePage() {
  const router = useRouter()

  const { data: session, status } = useSession()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [servings, setServings] = useState(4)
  const [isPublic, setIsPublic] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: "1", name: "", quantity: 0, unit: "" }])
  const [steps, setSteps] = useState<Step[]>([{ id: "1", instruction: "" }])

  useEffect(() => {
    if (status === "loading") {
      return
    }

    if (!session) {
      router.push("/auth/login")
    }
  }, [session, status, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        id: Date.now().toString(),
        name: "",
        quantity: 0,
        unit: "",
      },
    ])
  }

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id))
  }

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(ingredients.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing)))
  }

  const addStep = () => {
    setSteps([
      ...steps,
      {
        id: Date.now().toString(),
        instruction: "",
      },
    ])
  }

  const removeStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id))
  }

  const updateStep = (id: string, field: keyof Step, value: string | number) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, [field]: value } : step)))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          servings,
          isPublic,
          tags,
          ingredients: ingredients.filter((ing) => ing.name.trim()),
          steps: steps.filter((step) => step.instruction.trim()),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Failed to create recipe")
        return
      }

      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating recipe:", error)
      alert("An error occurred while creating the recipe")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">RecipeHub</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Recipe</h1>
          <p className="text-gray-600">Share your culinary creation with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Start with the basics - give your recipe a name and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Recipe Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Grandma's Chocolate Chip Cookies"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your recipe - what makes it special?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    value={servings}
                    onChange={(e) => setServings(Number.parseInt(e.target.value) || 1)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <div className="flex items-center space-x-2">
                    <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                    <span className="text-sm text-gray-600">{isPublic ? "Public" : "Private"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add tags to help others discover your recipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag (e.g., Vegetarian, Quick, Dessert)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
              <CardDescription>List all ingredients with quantities and units</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <div key={ingredient.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-6">
                    <Label htmlFor={`ingredient-${ingredient.id}`}>Ingredient {index + 1}</Label>
                    <Input
                      id={`ingredient-${ingredient.id}`}
                      placeholder="e.g., All-purpose flour"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`quantity-${ingredient.id}`}>Quantity</Label>
                    <Input
                      id={`quantity-${ingredient.id}`}
                      type="number"
                      step="0.1"
                      placeholder="2"
                      value={ingredient.quantity || ""}
                      onChange={(e) =>
                        updateIngredient(ingredient.id, "quantity", Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor={`unit-${ingredient.id}`}>Unit</Label>
                    <Input
                      id={`unit-${ingredient.id}`}
                      placeholder="cups"
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(ingredient.id, "unit", e.target.value)}
                    />
                  </div>
                  <div className="col-span-1">
                    {ingredients.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeIngredient(ingredient.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addIngredient}>
                <Plus className="w-4 h-4 mr-2" />
                Add Ingredient
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              <CardDescription>Break down your recipe into clear, step-by-step instructions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`step-${step.id}`}>Step {index + 1}</Label>
                    {steps.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeStep(step.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <Textarea
                    id={`step-${step.id}`}
                    placeholder="Describe this step in detail..."
                    value={step.instruction}
                    onChange={(e) => updateStep(step.id, "instruction", e.target.value)}
                    rows={2}
                  />

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      placeholder="Timer (minutes)"
                      className="w-32"
                      value={step.timer || ""}
                      onChange={(e) => updateStep(step.id, "timer", Number.parseInt(e.target.value) || undefined)}
                    />
                    <span className="text-sm text-gray-500">minutes (optional)</span>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addStep}>
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" size="lg">
              Create Recipe
            </Button>
            <Link href="/dashboard">
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
