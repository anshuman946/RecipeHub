"use client"

import { useState, useEffect, useCallback } from "react"
import { config } from "@/lib/config"

interface SyncOptions {
  interval?: number // polling interval in milliseconds
  enabled?: boolean
}

export function useRealTimeSync<T>(fetchFunction: () => Promise<T>, options: SyncOptions = {}) {
  const { interval = config.realtime.pollingInterval, enabled = config.features.realTimeSync } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  const [isPolling, setIsPolling] = useState(enabled)

  const syncData = useCallback(async () => {
    if (loading) return

    setLoading(true)
    setError(null)

    try {
      const result = await fetchFunction()
      setData(result)
      setLastSynced(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed")
    } finally {
      setLoading(false)
    }
  }, [fetchFunction, loading])

  // Initial fetch
  useEffect(() => {
    syncData()
  }, [syncData])

  // Polling
  useEffect(() => {
    if (!isPolling || !enabled) return

    const intervalId = setInterval(syncData, interval)
    return () => clearInterval(intervalId)
  }, [syncData, interval, isPolling, enabled])

  const togglePolling = () => setIsPolling(!isPolling)
  const manualSync = () => syncData()

  return {
    data,
    loading,
    error,
    lastSynced,
    isPolling,
    togglePolling,
    manualSync,
  }
}
