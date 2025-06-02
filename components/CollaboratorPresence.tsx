"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Users, Circle } from "lucide-react"

interface CollaboratorPresenceProps {
  recipeId: string
  currentUserId: string
}

interface ActiveCollaborator {
  userId: string
  userName: string
  lastSeen: string
  isActive: boolean
}

export function CollaboratorPresence({ recipeId, currentUserId }: CollaboratorPresenceProps) {
  const [activeCollaborators, setActiveCollaborators] = useState<ActiveCollaborator[]>([])

  useEffect(() => {
    // Simulate checking for active collaborators
    const checkPresence = async () => {
      try {
        const response = await fetch(`/api/recipes/${recipeId}/presence`)
        if (response.ok) {
          const data = await response.json()
          setActiveCollaborators(data.activeCollaborators || [])
        }
      } catch (error) {
        console.error("Failed to check presence:", error)
      }
    }

    // Update presence every 30 seconds
    const interval = setInterval(checkPresence, 30000)
    checkPresence()

    return () => clearInterval(interval)
  }, [recipeId])

  // Send heartbeat to indicate user is active
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await fetch(`/api/recipes/${recipeId}/presence`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "heartbeat" }),
        })
      } catch (error) {
        console.error("Failed to send heartbeat:", error)
      }
    }

    // Send heartbeat every 30 seconds
    const interval = setInterval(sendHeartbeat, 30000)
    sendHeartbeat()

    return () => clearInterval(interval)
  }, [recipeId])

  const otherActiveCollaborators = activeCollaborators.filter(
    (collab) => collab.userId !== currentUserId && collab.isActive,
  )

  if (otherActiveCollaborators.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
      <Users className="w-4 h-4 text-green-600" />
      <span className="text-sm text-green-800">
        {otherActiveCollaborators.length} collaborator{otherActiveCollaborators.length !== 1 ? "s" : ""} active:
      </span>
      <div className="flex gap-1">
        {otherActiveCollaborators.map((collab) => (
          <Badge key={collab.userId} variant="secondary" className="text-xs">
            <Circle className="w-2 h-2 mr-1 fill-green-500 text-green-500" />
            {collab.userName}
          </Badge>
        ))}
      </div>
    </div>
  )
}
