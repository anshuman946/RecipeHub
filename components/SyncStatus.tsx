"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Wifi, WifiOff, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface SyncStatusProps {
  isPolling: boolean
  loading: boolean
  lastSynced: Date | null
  error: string | null
  onTogglePolling: () => void
  onManualSync: () => void
}

export function SyncStatus({ isPolling, loading, lastSynced, error, onTogglePolling, onManualSync }: SyncStatusProps) {
  const formatLastSynced = (date: Date | null) => {
    if (!date) return "Never"
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)

    if (seconds < 60) return `${seconds}s ago`
    if (minutes < 60) return `${minutes}m ago`
    return date.toLocaleTimeString()
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
      <div className="flex items-center gap-2">
        {isPolling ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-gray-400" />}
        <Badge variant={isPolling ? "default" : "secondary"}>{isPolling ? "Live Sync" : "Manual Sync"}</Badge>
      </div>

      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Clock className="w-3 h-3" />
        <span>Last synced: {formatLastSynced(lastSynced)}</span>
      </div>

      {error && (
        <Badge variant="destructive" className="text-xs">
          Sync Error
        </Badge>
      )}

      <div className="flex gap-2 ml-auto">
        <Button variant="outline" size="sm" onClick={onTogglePolling} className="text-xs">
          {isPolling ? "Disable Auto-Sync" : "Enable Auto-Sync"}
        </Button>
        <Button variant="outline" size="sm" onClick={onManualSync} disabled={loading} className="text-xs">
          <RefreshCw className={cn("w-3 h-3 mr-1", loading && "animate-spin")} />
          Sync Now
        </Button>
      </div>
    </div>
  )
}
