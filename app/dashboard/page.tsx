"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Users, Edit, Share, Heart, Mail } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Recipe {
  _id: string
  title: string
  description: string
  servings: number
  tags: string[]
  collaborators: string[]
  author: string
  authorId: string
  createdAt: string
  isPublic: boolean
  likes: number
  views: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([])
  const [collaborativeRecipes, setCollaborativeRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [pendingInvitations, setPendingInvitations] = useState([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchRecipes()
      fetchInvitations()
    }
  }, [session])

  const fetchRecipes = async () => {
    try {
      const [myRecipesRes, collaborativeRecipesRes] = await Promise.all([
        fetch("/api/user/recipes?type=my"),
        fetch("/api/user/recipes?type=collaborative"),
      ])

      if (myRecipesRes.ok) {
        const myData = await myRecipesRes.json()
        setMyRecipes(myData.recipes)
      }

      if (collaborativeRecipesRes.ok) {
        const collabData = await collaborativeRecipesRes.json()
        setCollaborativeRecipes(collabData.recipes)
      }
    } catch (error) {
      console.error("Error fetching recipes:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInvitations = async () => {
    try {
      const response = await fetch("/api/user/invitations")
      if (response.ok) {
        const data = await response.json()
        setPendingInvitations(data.invitations)
      }
    } catch (error) {
      console.error("Error fetching invitations:", error)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  const filteredMyRecipes = myRecipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const filteredCollaborativeRecipes = collaborativeRecipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">RecipeHub</span>
          </Link>

          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {session.user.name}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Recipe Dashboard</h1>
            <p className="text-gray-600">Manage your recipes and collaborations</p>
          </div>
          <Link href="/recipes/new">
            <Button className="mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Create New Recipe
            </Button>
          </Link>
        </div>

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <Alert className="mb-8">
            <Mail className="h-4 w-4" />
            <AlertDescription>
              You have {pendingInvitations.length} pending recipe collaboration invitation
              {pendingInvitations.length !== 1 ? "s" : ""}!{" "}
              <Link href="/invitations" className="font-medium underline">
                View invitations
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search recipes by title or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Recipes</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myRecipes.length}</div>
              <p className="text-xs text-muted-foreground">{myRecipes.filter((r) => r.isPublic).length} public</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collaborations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collaborativeRecipes.length}</div>
              <p className="text-xs text-muted-foreground">Active collaborations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myRecipes.reduce((sum, recipe) => sum + recipe.likes, 0)}</div>
              <p className="text-xs text-muted-foreground">On your recipes</p>
            </CardContent>
          </Card>
        </div>

        {/* Recipe Tabs */}
        <Tabs defaultValue="my-recipes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
            <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
          </TabsList>

          <TabsContent value="my-recipes" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMyRecipes.map((recipe) => (
                <Card key={recipe._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{recipe.title}</CardTitle>
                        <CardDescription className="mt-2">{recipe.description}</CardDescription>
                      </div>
                      <Badge variant={recipe.isPublic ? "default" : "secondary"}>
                        {recipe.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{recipe.servings} servings</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{recipe.collaborators.length} collaborators</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{recipe.likes}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {recipe.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs text-gray-500">
                          Created {new Date(recipe.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <Link href={`/recipes/${recipe._id}/edit`}>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline">
                            <Share className="w-4 h-4" />
                          </Button>
                          <Link href={`/recipes/${recipe._id}`}>
                            <Button size="sm">View</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collaborations" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollaborativeRecipes.map((recipe) => (
                <Card key={recipe._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{recipe.title}</CardTitle>
                        <CardDescription className="mt-2">{recipe.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">Collaborator</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{recipe.servings} servings</span>
                        <span>•</span>
                        <span>by {recipe.author}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {recipe.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>{recipe.collaborators.length} collaborators</span>
                        </div>
                        <Link href={`/recipes/${recipe._id}`}>
                          <Button size="sm">View & Edit</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
