"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PROMPT_TYPES } from "@/lib/constants"
import { Copy, ExternalLink, Sparkles, Loader2 } from "@/components/simple-icons"
import { useState } from "react"

interface AnalysisResult {
  analysis: string
  segment: string
  promptType: string
  product: string
  objective: string
}

interface AnalysisGridProps {
  results: AnalysisResult[]
  selectedSegment: string
  onPromptTypeChange: (promptType: string) => void
  selectedPromptType: string
  product: string
  objective: string
  onGenerate: (promptType: string) => void
  isGenerating: boolean
  onViewFullAnalysis: (promptType: string) => void
}

export function AnalysisGrid({
  results,
  selectedSegment,
  onPromptTypeChange,
  selectedPromptType,
  product,
  objective,
  onGenerate,
  isGenerating,
  onViewFullAnalysis,
}: AnalysisGridProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const segmentResults = results.filter((r) => r.segment === selectedSegment)

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const formatAnalysis = (text: string) => {
    const cleanText = text
      .replace(/<strong>(.*?)<\/strong>/g, "$1")
      .replace(/<br\s*\/?>/g, "\n")
      .replace(/<em>(.*?)<\/em>/g, "$1")
      .replace(/<[^>]*>/g, "")
      .trim()

    return cleanText.split("\n").map((line, index) => {
      if (line.trim() === "") return null

      const processedLine = line.replace(/\*\*(.*?)\*\*/g, "$1")
      const isBold = line.includes("**") || (line.includes(":") && line.length < 100)

      return (
        <div key={index} className={`mb-1 ${isBold ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
          {processedLine}
        </div>
      )
    })
  }

  const handleGenerateForCard = async (promptType: string) => {
    console.log("[v0] Generating analysis for card:", promptType)
    onPromptTypeChange(promptType)
    await onGenerate(promptType)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {PROMPT_TYPES.map((promptType, index) => {
        const result = segmentResults.find((r) => r.promptType === promptType.id)
        const isSelected = selectedPromptType === promptType.id
        const copyId = `${selectedSegment}-${promptType.id}`
        const isGeneratingThis = isGenerating && selectedPromptType === promptType.id

        return (
          <Card
            key={promptType.id}
            className={`cursor-pointer performance-optimized hover-lift glass-effect transition-all duration-300 ${
              isSelected ? "ring-2 ring-primary shadow-lg shadow-primary/20 animate-glow" : ""
            } ${result ? "gradient-border animate-in fade-in slide-in-from-bottom-4" : "border-border"}`}
            onClick={() => onPromptTypeChange(promptType.id)}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "both",
            }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <span
                    className="text-lg transition-all duration-300 hover:scale-110 hover:rotate-12 animate-float"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {promptType.icon}
                  </span>
                  <span className="text-gradient font-semibold">{promptType.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {result && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(result.analysis, copyId)
                      }}
                      className="h-7 w-7 p-0 transition-all duration-200 hover:scale-110 hover:bg-accent/20"
                    >
                      {copiedId === copyId ? (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1 py-0 animate-in fade-in scale-in bg-primary/20 text-primary"
                        >
                          ✓
                        </Badge>
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                  {result ? (
                    <Badge
                      variant="secondary"
                      className="text-xs animate-in fade-in slide-in-from-right bg-accent/20 text-accent border-accent/30"
                    >
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs border-muted-foreground/30 text-muted-foreground">
                      Pending
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {result ? (
                <div className="space-y-3">
                  <div className="text-sm text-foreground max-h-32 overflow-hidden">
                    {formatAnalysis(result.analysis.slice(0, 200) + (result.analysis.length > 200 ? "..." : ""))}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full glass-effect hover-lift border-primary/30 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewFullAnalysis(promptType.id)
                    }}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Full Analysis
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="w-12 h-12 mx-auto glass-effect rounded-full flex items-center justify-center mb-3 hover-lift animate-pulse-slow">
                    <span className="text-lg animate-float" style={{ animationDelay: `${index * 150}ms` }}>
                      {promptType.icon}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={!product || !objective || isGenerating}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleGenerateForCard(promptType.id)
                    }}
                    className="text-sm hover:bg-accent/20 hover:text-accent transition-all duration-300 hover:scale-105"
                  >
                    {isGeneratingThis ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        <span className="animate-shimmer bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-[length:200%_100%] bg-clip-text text-transparent">
                          Generating...
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
                        Click to generate analysis
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
