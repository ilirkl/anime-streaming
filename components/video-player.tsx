"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, Expand, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export function VideoPlayer() {
  const searchParams = useSearchParams()
  const currentEpisode = searchParams.get("ep") || "1"
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100
    }
  }, [volume])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div ref={containerRef} className="relative aspect-video bg-black">
      <video
        ref={videoRef}
        src={`/placeholder.mp4?ep=${currentEpisode}`}
        className="h-full w-full"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex flex-col gap-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <span className="text-sm text-white">
                {formatTime(currentTime)}/{formatTime(duration || 0)}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  className="w-[100px]"
                  onValueChange={(value) => setVolume(value[0])}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Expand className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 left-4 right-4 flex justify-between">
        <Button variant="secondary">SUB</Button>
        <Button variant="secondary">DUB</Button>
      </div>

      <div className="absolute left-4 right-4 top-4 flex items-center justify-between text-white">
        <div>
          <p className="text-sm opacity-80">You are watching</p>
          <p className="font-medium">Episode {currentEpisode}</p>
        </div>
        <div className="text-sm">
          <p>If current server doesn&apos;t work</p>
          <p>please try other servers beside.</p>
        </div>
      </div>
    </div>
  )
}

