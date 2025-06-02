"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Mail } from "lucide-react"

interface CollaborationModalProps {
  recipeId: string
  recipeName: string
  onSuccess?: () => void
}

export function CollaborationModal({ recipeId, recipeName, onSuccess }: CollaborationModalProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/recipes/${recipeId}/collaborate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          message: message.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to send invitation")
        return
      }

      setSuccess("Collaboration invitation sent successfully!")
      setEmail("")
      setMessage("")

      if (onSuccess) {
        onSuccess()
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        setOpen(false)
        setSuccess("")
      }, 2000)
    } catch (err) {
      setError("An error occurred while sending the invitation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Collaborator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Collaborator</DialogTitle>
          <DialogDescription>
            Invite someone to collaborate on "{recipeName}". They'll be able to edit the recipe while you maintain
            credit as the original creator.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="collaborator@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500">The person must have a RecipeHub account to collaborate.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Personal Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal note to your invitation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Collaboration Features:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Edit ingredients and instructions</li>
              <li>• Add cooking tips and variations</li>
              <li>• You remain credited as the original creator</li>
              <li>• Real-time collaborative editing</li>
            </ul>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !email.trim()}>
              {loading ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
