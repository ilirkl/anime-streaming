"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary">H!Anime</h1>
          </Link>
          <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="search"
              placeholder="Search anime..."
              className="w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="secondary" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            <Link href="/watch2gether" className="text-sm font-medium">
              Watch2gether
            </Link>
            <Link href="/random" className="text-sm font-medium">
              Random
            </Link>
            <Link href="/browse" className="text-sm font-medium">
              Browse
            </Link>
            <Link href="/community" className="text-sm font-medium">
              Community
            </Link>
          </nav>
          <Button variant="secondary" size="sm">
            EN
          </Button>
          <Button>Login</Button>
        </div>
      </div>
    </header>
  )
}

