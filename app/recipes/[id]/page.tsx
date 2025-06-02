"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Users, Scale, Timer, Play, Pause, RotateCcw, Share, Edit, Clock } from "lucide-react"
import { useSession } from "next-auth/react"
import { CollaborationModal } from "@/components/CollaborationModal"
import { SyncStatus } from "@/components/SyncStatus"
import { RecentActivity } from "@/components/RecentActivity"
import { useRealTimeSync } from "@/hooks/useRealTimeSync"

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

interface Recipe {
  _id: string
  title: string
  description: string
  servings: number
  tags: string[]
  ingredients: Ingredient[]
  steps: Step[]
  author: string
  authorId: string
  collaborators: any[]
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

interface SyncData {
  recipe: Recipe
  recentActivity: any[]
  collaboratorActivity: any[]
  syncTimestamp: string
}

export default function RecipeViewPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [currentServings, setCurrentServings] = useState(4)
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  // Real-time sync functionality
  const fetchRecipeData = useCallback(async (): Promise<SyncData> => {
    const response = await fetch(`/api/recipes/${params.id}/sync`)
    if (!response.ok) {
      throw new Error("Failed to fetch recipe data")
    }
    return response.json()
  }, [params.id])

  const {
    data: syncData,
    loading: syncLoading,
    error: syncError,
    lastSynced,
    isPolling,
    togglePolling,
    manualSync,
  } = useRealTimeSync(fetchRecipeData, {
    interval: 10000, // Poll every 10 seconds
    enabled: true,
  })

  const recipe = syncData?.recipe

  // Update servings when recipe loads
  useEffect(() => {
    if (recipe && currentServings === 4) {
      setCurrentServings(recipe.servings)
    }
  }, [recipe, currentServings])

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            setActiveTimer(null)
            // In a real app, you'd show a notification or play a sound
            alert("Timer finished!")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isTimerRunning, timerSeconds])

  const startTimer = (stepId: string, minutes: number) => {
    setActiveTimer(stepId)
    setTimerSeconds(minutes * 60)
    setIsTimerRunning(true)
  }

  const pauseTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setActiveTimer(null)
    setTimerSeconds(0)
  }

  const toggleStepCompletion = async (stepId: string) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId)
    } else {
      newCompleted.add(stepId)
    }
    setCompletedSteps(newCompleted)

    // Log activity
    try {
      await fetch(`/api/recipes/${params.id}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: newCompleted.has(stepId) ? "complete" : "uncomplete",
          details: `Marked step ${stepId} as ${newCompleted.has(stepId) ? "completed" : "incomplete"}`,
        }),
      })
    } catch (error) {
      console.error("Failed to log activity:", error)
    }
  }

  const scaleIngredient = (originalQuantity: number, originalServings: number, newServings: number) => {
    return ((originalQuantity * newServings) / originalServings).toFixed(2).replace(/\.?0+$/, "")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading recipe...</div>
      </div>
    )
  }

  const scalingRatio = currentServings / recipe.servings
  const progress = (completedSteps.size / recipe.steps.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center space-x-2">
            <CollaborationModal
              recipeId={recipe._id}
              recipeName={recipe.title}
              onSuccess={() => {
                manualSync()
              }}
            />
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Link href={`/recipes/${recipe._id}/edit`}>
              <Button size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Sync Status */}
        <div className="mb-6">
          <SyncStatus
            isPolling={isPolling}
            loading={syncLoading}
            lastSynced={lastSynced}
            error={syncError}
            onTogglePolling={togglePolling}
            onManualSync={manualSync}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recipe Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{recipe.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    Created by <strong>{recipe.author}</strong>
                  </span>
                </div>
                {recipe.collaborators.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>
                      {recipe.collaborators.length} collaborator{recipe.collaborators.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated {new Date(recipe.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Cooking Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Steps completed</span>
                    <span>
                      {completedSteps.size} of {recipe.steps.length}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Active Timer */}
            {activeTimer && (
              <Alert>
                <Timer className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Timer running: {formatTime(timerSeconds)}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={pauseTimer}>
                      {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={resetTimer}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>Follow these steps to create your recipe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {recipe.steps.map((step, index) => (
                  <div key={step.id} className="space-y-3">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          completedSteps.has(step.id) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`text-gray-900 ${completedSteps.has(step.id) ? "line-through opacity-60" : ""}`}>
                          {step.instruction}
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          <Button
                            size="sm"
                            variant={completedSteps.has(step.id) ? "default" : "outline"}
                            onClick={() => toggleStepCompletion(step.id)}
                          >
                            {completedSteps.has(step.id) ? "Completed" : "Mark Complete"}
                          </Button>

                          {step.timer && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startTimer(step.id, step.timer!)}
                              disabled={activeTimer === step.id}
                            >
                              <Timer className="w-4 h-4 mr-2" />
                              {activeTimer === step.id ? "Timer Active" : `${step.timer} min`}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {index < recipe.steps.length - 1 && <Separator className="ml-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            {syncData?.recentActivity && <RecentActivity activities={syncData.recentActivity} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Serving Scaler */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Scale Recipe
                </CardTitle>
                <CardDescription>Adjust ingredient quantities for different serving sizes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    value={currentServings}
                    onChange={(e) => setCurrentServings(Number.parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  Original recipe serves {recipe.servings}
                  {scalingRatio !== 1 && (
                    <span className="block text-orange-600 font-medium">Scaling by {scalingRatio.toFixed(2)}x</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
                <CardDescription>
                  For {currentServings} serving{currentServings !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.id} className="flex justify-between items-center">
                      <span className="text-gray-900">{ingredient.name}</span>
                      <span className="text-gray-600 font-medium">
                        {scaleIngredient(ingredient.quantity, recipe.servings, currentServings)} {ingredient.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Collaborators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Collaborators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{recipe.author.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{recipe.author}</p>
                      <p className="text-xs text-gray-500">Recipe Author</p>
                    </div>
                  </div>

                  {recipe.collaborators.map((collaborator, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {collaborator.name?.charAt(0).toUpperCase() || collaborator.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{collaborator.name || collaborator.email}</p>
                        <p className="text-xs text-gray-500">Collaborator</p>
                      </div>
                    </div>
                  ))}

                  <CollaborationModal
                    recipeId={recipe._id}
                    recipeName={recipe.title}
                    onSuccess={() => {
                      manualSync()
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
