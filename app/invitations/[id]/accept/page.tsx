"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Clock } from "lucide-react"

export default function AcceptInvitationPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  const handleAccept = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/invitations/${params.id}/accept`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to accept invitation")
        return
      }

      setMessage("Invitation accepted successfully! Redirecting to recipe...")
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError("An error occurred while accepting the invitation")
    } finally {
      setLoading(false)
    }
  }

  const handleDecline = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/invitations/${params.id}/decline`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to decline invitation")
        return
      }

      setMessage("Invitation declined.")
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError("An error occurred while declining the invitation")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">RecipeHub</span>
          </div>
          <CardTitle>Recipe Collaboration Invitation</CardTitle>
          <CardDescription>You've been invited to collaborate on a recipe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {!message && !error && (
            <>
              <div className="text-center space-y-4">
                <Clock className="w-12 h-12 text-orange-500 mx-auto" />
                <p className="text-gray-600">You're about to respond to a recipe collaboration invitation.</p>
                <p className="text-sm text-gray-500">
                  As a collaborator, you'll be able to edit the recipe while the original creator maintains credit.
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAccept} disabled={loading} className="flex-1">
                  {loading ? "Processing..." : "Accept Invitation"}
                </Button>
                <Button onClick={handleDecline} variant="outline" disabled={loading} className="flex-1">
                  Decline
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
