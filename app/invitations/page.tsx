"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, Clock, User, ChefHat } from "lucide-react"

interface Invitation {
  _id: string
  recipeId: string
  invitedBy: string
  invitedByName: string
  message: string
  createdAt: string
  expiresAt: string
  recipe: {
    title: string
    description: string
    author: string
    tags: string[]
  }
}

export default function InvitationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchInvitations()
    }
  }, [session])

  const fetchInvitations = async () => {
    try {
      const response = await fetch("/api/user/invitations")
      if (response.ok) {
        const data = await response.json()
        setInvitations(data.invitations)
      }
    } catch (error) {
      console.error("Error fetching invitations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = async (invitationId: string, action: "accept" | "decline") => {
    try {
      const response = await fetch(`/api/invitations/${invitationId}/${action}`, {
        method: "POST",
      })

      if (response.ok) {
        // Remove the invitation from the list
        setInvitations(invitations.filter((inv) => inv._id !== invitationId))

        if (action === "accept") {
          // Redirect to dashboard after accepting
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        }
      }
    } catch (error) {
      console.error(`Error ${action}ing invitation:`, error)
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipe Collaboration Invitations</h1>
          <p className="text-gray-600">Respond to invitations to collaborate on recipes</p>
        </div>

        {invitations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending invitations</h3>
              <p className="text-gray-600 mb-4">You don't have any pending recipe collaboration invitations.</p>
              <Link href="/recipes">
                <Button>Browse Public Recipes</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {invitations.map((invitation) => (
              <Card key={invitation._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <ChefHat className="w-5 h-5 text-orange-500" />
                        {invitation.recipe.title}
                      </CardTitle>
                      <CardDescription className="mt-2">{invitation.recipe.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>
                        Invited by <strong>{invitation.invitedByName}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Original creator: <strong>{invitation.recipe.author}</strong>
                      </span>
                    </div>

                    {invitation.message && (
                      <Alert>
                        <AlertDescription>
                          <strong>Personal message:</strong> "{invitation.message}"
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {invitation.recipe.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-1">As a collaborator, you can:</h4>
                      <ul className="text-xs text-blue-800 space-y-1">
                        <li>• Edit ingredients and cooking instructions</li>
                        <li>• Add your own tips and variations</li>
                        <li>• Help improve the recipe together</li>
                        <li>• The original creator ({invitation.recipe.author}) will always get credit</li>
                      </ul>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button onClick={() => handleResponse(invitation._id, "accept")} className="flex-1">
                        Accept Invitation
                      </Button>
                      <Button
                        onClick={() => handleResponse(invitation._id, "decline")}
                        variant="outline"
                        className="flex-1"
                      >
                        Decline
                      </Button>
                      <Link href={`/recipes/${invitation.recipeId}`}>
                        <Button variant="ghost">View Recipe</Button>
                      </Link>
                    </div>

                    <p className="text-xs text-gray-500">
                      Invited {new Date(invitation.createdAt).toLocaleDateString()} • Expires{" "}
                      {new Date(invitation.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
