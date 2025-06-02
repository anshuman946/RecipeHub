import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Scale, Timer } from "lucide-react"

export default function HomePage() {
  const featuredRecipes = [
    {
      id: 1,
      title: "Classic Chocolate Chip Cookies",
      description: "Perfectly chewy cookies with the right amount of chocolate chips",
      servings: 24,
      tags: ["Dessert", "Baking"],
      collaborators: 3,
      author: "Sarah Johnson",
    },
    {
      id: 2,
      title: "Vegetarian Pasta Primavera",
      description: "Fresh vegetables tossed with pasta in a light cream sauce",
      servings: 4,
      tags: ["Vegetarian", "Pasta", "Quick"],
      collaborators: 2,
      author: "Mike Chen",
    },
    {
      id: 3,
      title: "Homemade Sourdough Bread",
      description: "Traditional sourdough with a perfect crust and tangy flavor",
      servings: 8,
      tags: ["Bread", "Fermented"],
      collaborators: 5,
      author: "Emma Wilson",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">RecipeHub</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/recipes" className="text-gray-600 hover:text-gray-900">
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Collaborate on Recipes Like Never Before</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, share, and perfect recipes together. Scale ingredients automatically, follow step-by-step timers,
            and collaborate in real-time with fellow food enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Start Cooking Together
              </Button>
            </Link>
            <Link href="/recipes">
              <Button size="lg" variant="outline">
                Browse Public Recipes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose RecipeHub?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Collaboration</h3>
              <p className="text-gray-600">Invite friends and family to co-author recipes together</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Scaling</h3>
              <p className="text-gray-600">Automatically adjust ingredient quantities for any serving size</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Timer className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Built-in Timers</h3>
              <p className="text-gray-600">Step-by-step cooking timers with audio alerts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Version Control</h3>
              <p className="text-gray-600">Track changes and improvements like GitHub for recipes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Recipes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
              <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{recipe.title}</CardTitle>
                      <CardDescription className="mt-2">{recipe.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                    <Users className="w-4 h-4" />
                    <span>{recipe.collaborators} collaborators</span>
                    <span>•</span>
                    <span>{recipe.servings} servings</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">by {recipe.author}</span>
                    <Link href={`/recipes/${recipe.id}`}>
                      <Button size="sm">View Recipe</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-bold">RecipeHub</span>
              </div>
              <p className="text-gray-400">The collaborative platform for recipe creation and sharing.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features">Features</Link>
                </li>
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="/recipes">Browse Recipes</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 RecipeHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
