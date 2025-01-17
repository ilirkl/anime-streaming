import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

async function searchAnime(query: string) {
  const { data, error } = await supabase
    .from('anime')
    .select('*')
    .ilike('title', `%${query}%`)
    .limit(20)

  if (error) {
    console.error('Error searching anime:', error)
    return []
  }

  return data
}

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q
  const searchResults = await searchAnime(query)

  return (
    <div className="container py-6">
      <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {searchResults.map((anime) => (
          <Card key={anime.id}>
            <CardContent className="p-0">
              <Link href={`/watch/${anime.id}`}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                  <Image
                    src={anime.cover_image || "/placeholder.svg"}
                    alt={`${anime.title} cover`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{anime.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Episodes: {anime.episode_count}
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      {searchResults.length === 0 && (
        <p className="text-center text-muted-foreground">No results found.</p>
      )}
    </div>
  )
}

