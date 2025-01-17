import Image from "next/image"
import Link from "next/link"
import { Star } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

async function getLatestAnime() {
  const { data, error } = await supabase
    .from('anime')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(8)

  if (error) {
    console.error('Error fetching latest anime:', error)
    return []
  }

  return data
}

export default async function Home() {
  const latestAnime = await getLatestAnime()

  return (
    <div className="container py-6">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Updated</h2>
          <Link href="/browse" className="text-sm text-primary">
            View all
          </Link>
        </div>
        {latestAnime.length === 0 ? (
          <p>No anime found. Please sync  the admin page.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {latestAnime.map((anime) => (
              <Card key={anime.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <Link href={`/watch/${anime.id}`}>
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={anime.cover_image || "/placeholder.svg"}
                        alt={anime.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center gap-2">
                          {anime.score && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              <span className="text-sm font-medium text-white">
                                {anime.score.toFixed(1)}
                              </span>
                            </div>
                          )}
                          <Badge variant="secondary" className="bg-white/10">
                            {anime.rating}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-1">{anime.title}</h3>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {anime.genres?.slice(0, 3).map((genre) => (
                          <Badge key={genre} variant="outline" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {anime.description}
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

