"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Episode {
  id: number
  title: string
  episode_number: number
}

interface EpisodeListProps {
  episodes: Episode[]
  animeId: string
}

export function EpisodeList({ episodes, animeId }: EpisodeListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentEpisode = searchParams.get("ep")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEpisodes = episodes.filter(episode =>
    episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    episode.episode_number.toString().includes(searchQuery)
  )

  const handleEpisodeClick = (episodeNumber: number) => {
    router.push(`/watch/${animeId}?ep=${episodeNumber}`)
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">List of episodes:</h2>
          <div className="relative w-[140px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Number of Ep"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="h-[600px] pr-4">
          <div className="mt-4 space-y-1">
            {filteredEpisodes.map((episode) => (
              <Button
                key={episode.id}
                variant={currentEpisode === episode.episode_number.toString() ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleEpisodeClick(episode.episode_number)}
              >
                <div className="flex items-center gap-4">
                  <span className="w-6">{episode.episode_number}</span>
                  <span className="flex-1 truncate">{episode.title}</span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

