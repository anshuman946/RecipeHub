"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, Heart } from "lucide-react"

interface Recipe {
  id: string
  title: string
  description: string
  servings: number
  tags: string[]
  collaborators: number
  author: string
  createdAt: string
  isPublic: boolean
  likes: number
  _id: string
}

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  // Mock data - in real app, this would come from API
  const [recipes] = useState<Recipe[]>([
    {
      id: "1",
      title: "Classic Chocolate Chip Cookies",
      description: "Perfectly chewy cookies with the right amount of chocolate chips",
      servings: 24,
      tags: ["Dessert", "Baking", "Quick"],
      collaborators: 3,
      author: "Sarah Johnson",
      createdAt: "2024-01-20",
      isPublic: true,
      likes: 127,
      _id: "1",
    },
    {
      id: "2",
      title: "Vegetarian Pasta Primavera",
      description: "Fresh vegetables tossed with pasta in a light cream sauce",
      servings: 4,
      tags: ["Vegetarian", "Pasta", "Quick", "Healthy"],
      collaborators: 2,
      author: "Mike Chen",
      createdAt: "2024-01-18",
      isPublic: true,
      likes: 89,
      _id: "2",
    },
    {
      id: "3",
      title: "Homemade Sourdough Bread",
      description: "Traditional sourdough with a perfect crust and tangy flavor",
      servings: 8,
      tags: ["Bread", "Fermented", "Traditional"],
      collaborators: 5,
      author: "Emma Wilson",
      createdAt: "2024-01-15",
      isPublic: true,
      likes: 203,
      _id: "3",
    },
    {
      id: "4",
      title: "Thai Green Curry",
      description: "Authentic Thai green curry with coconut milk and fresh herbs",
      servings: 4,
      tags: ["Thai", "Spicy", "Curry", "Asian"],
      collaborators: 1,
      author: "James Park",
      createdAt: "2024-01-12",
      isPublic: true,
      likes: 156,
      _id: "4",
    },
    {
      id: "5",
      title: "Classic Caesar Salad",
      description: "Crisp romaine lettuce with homemade dressing and croutons",
      servings: 4,
      tags: ["Salad", "Quick", "Healthy"],
      collaborators: 2,
      author: "Lisa Rodriguez",
      createdAt: "2024-01-10",
      isPublic: true,
      likes: 74,
      _id: "5",
    },
    {
      id: "6",
      title: "Beef Bourguignon",
      description: "Classic French beef stew braised in red wine",
      servings: 6,
      tags: ["French", "Beef", "Stew", "Traditional"],
      collaborators: 4,
      author: "Pierre Dubois",
      createdAt: "2024-01-08",
      isPublic: true,
      likes: 198,
      _id: "6",
    },
  ])

  const allTags = Array.from(new Set(recipes.flatMap((recipe) => recipe.tags)))

  const filteredRecipes = recipes
    .filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesTag = selectedTag === "all" || recipe.tags.includes(selectedTag)
      return matchesSearch && matchesTag
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.likes - a.likes
        case "collaborative":
          return b.collaborators - a.collaborators
        case "recent":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

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

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/recipes" className="text-orange-600 font-medium">
              Browse Recipes
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Recipes</h1>
          <p className="text-gray-600">Discover amazing recipes created by our community</p>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="collaborative">Most Collaborative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""}
            {selectedTag !== "all" && ` tagged with "${selectedTag}"`}
          </p>
        </div>

        {/* Recipe Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{recipe.title}</CardTitle>
                    <CardDescription className="mt-2">{recipe.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.collaborators} collaborators</span>
                    </div>
                    <span>•</span>
                    <span>{recipe.servings} servings</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {recipe.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{recipe.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>by {recipe.author}</span>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{recipe.likes}</span>
                      </div>
                    </div>
                    <Link href={`/recipes/${recipe._id}`}>
                      <Button size="sm">View Recipe</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedTag("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
