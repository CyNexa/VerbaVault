"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Volume2, BookOpen } from "lucide-react"

export default function DictionaryApp() {
  const [searchTerm, setSearchTerm] = useState("")
  const [definitions, setDefinitions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const searchWord = async () => {
  if (!searchTerm.trim()) return

  setLoading(true)
  setError("")
  setDefinitions([])

  try {
    console.log(`[v0] Searching for word: ${searchTerm}`)
    const response = await fetch(
      `http://localhost:5000/api/dictionary/${searchTerm.toLowerCase()}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Word not found")
    }

    const data = await response.json()
    console.log(`[v0] Received definitions:`, data)
    setDefinitions(data)
  } catch (err) {
    console.error(`[v0] Search error:`, err)
    setError(err.message || "Failed to fetch definition")
  } finally {
    setLoading(false)
  }
}

  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play().catch((err) => console.error("[v0] Audio play error:", err))
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchWord()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Dictionary</h1>
          </div>
          <p className="text-muted-foreground text-lg">Discover meanings, pronunciations, and examples</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter a word to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-lg"
                disabled={loading}
              />
              <Button onClick={searchWord} disabled={loading || !searchTerm.trim()} className="px-6">
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="p-4">
              <p className="text-destructive text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {definitions.length > 0 && (
          <div className="space-y-6">
            {definitions.map((entry, entryIndex) => (
              <Card key={entryIndex} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-primary capitalize">{entry.word}</CardTitle>
                      {entry.phonetic && <CardDescription className="text-base mt-1">{entry.phonetic}</CardDescription>}
                    </div>
                    {entry.audio && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playAudio(entry.audio)}
                        className="flex items-center gap-2"
                      >
                        <Volume2 className="h-4 w-4" />
                        Play
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-6">
                    {entry.meanings.map((meaning, meaningIndex) => (
                      <div key={meaningIndex}>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-sm">
                            {meaning.partOfSpeech}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          {meaning.definitions.map((def, defIndex) => (
                            <div key={defIndex} className="pl-4 border-l-2 border-muted">
                              <p className="text-foreground mb-2 leading-relaxed">{def.definition}</p>
                              {def.example && (
                                <p className="text-muted-foreground italic text-sm">Example: "{def.example}"</p>
                              )}
                            </div>
                          ))}
                        </div>

                        {meaningIndex < entry.meanings.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Instructions */}
        {definitions.length === 0 && !error && !loading && (
          <Card className="text-center">
            <CardContent className="p-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Ready to explore words?</h3>
              <p className="text-muted-foreground">
                Enter any word in the search box above to get its definition, pronunciation, and examples.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
