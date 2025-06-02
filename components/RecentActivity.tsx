"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, User, Edit, Plus, Trash2 } from "lucide-react"

interface ActivityItem {
  _id: string
  userId: string
  userName: string
  action: string
  details: string
  timestamp: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "edit":
        return <Edit className="w-3 h-3" />
      case "add":
        return <Plus className="w-3 h-3" />
      case "delete":
        return <Trash2 className="w-3 h-3" />
      default:
        return <Activity className="w-3 h-3" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "edit":
        return "bg-blue-100 text-blue-800"
      case "add":
        return "bg-green-100 text-green-800"
      case "delete":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>No recent activity on this recipe</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest changes by collaborators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3" />
                </div>
                <Badge className={`text-xs ${getActionColor(activity.action)}`}>
                  {getActionIcon(activity.action)}
                  <span className="ml-1">{activity.action}</span>
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.userName}</p>
                <p className="text-xs text-gray-600 truncate">{activity.details}</p>
                <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
