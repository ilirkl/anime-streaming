'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { syncAnimeData } from '../actions'

export default function AdminPage() {
  const [malId, setMalId] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const handleSync = async () => {
    setStatus('Syncing...')
    setError('')
    const result = await syncAnimeData(parseInt(malId))
    if (result.success) {
      setStatus('Sync complete!')
    } else {
      setStatus('Sync failed')
      setError(JSON.stringify(result.error, null, 2))
    }
  }

  return (
    <div className="container py-6">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Sync Anime Data</h1>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="MyAnimeList ID"
            value={malId}
            onChange={(e) => setMalId(e.target.value)}
          />
          <Button onClick={handleSync}>Sync</Button>
        </div>
        {status && <p>{status}</p>}
        {error && (
          <pre className="mt-4 whitespace-pre-wrap break-words bg-red-100 p-4 text-red-900">
            {error}
          </pre>
        )}
      </div>
    </div>
  )
}

