"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PROMPT_TYPES } from "@/lib/constants"
import { Sparkles, Loader2 } from "@/components/simple-icons"

interface AnalysisResult {
  analysis: string
  segment: string
  promptType: string
  product: string
  objective: string
  isSample?: boolean
  message?: string
}

interface AnalysisDetailProps {
  result?: AnalysisResult
  selectedSegment: string
  selectedPromptType: string
  onGenerate: () => void
  isGenerating: boolean
}

export const AnalysisDetail = React.memo(function AnalysisDetail({
  result,
  selectedSegment,
  selectedPromptType,
  onGenerate,
  isGenerating,
}: AnalysisDetailProps) {
  const promptType = PROMPT_TYPES.find((p) => p.id === selectedPromptType)

  const formatAnalysisContent = (content: string) => {
    const cleanText = content
      .replace(/<strong>(.*?)<\/strong>/g, "$1")
      .replace(/<br\s*\/?>/g, "\n")
      .replace(/<em>(.*?)<\/em>/g, "$1")
      .replace(/<[^>]*>/g, "")
      .trim()

    return cleanText.split("\n").map((line, index) => {
      if (line.trim() === "") return <br key={index} />

      // Convert **text** to bold and check for headers
      const processedLine = line.replace(/\*\*(.*?)\*\*/g, "$1")
      const isBold =
        line.includes("**") ||
        line.includes(":") ||
        line.match(
          /^(Strengths?|Weaknesses?|Opportunities?|Threats?|OKR|Objective|Key Results?|Market|Position|Strategy)/i,
        )

      return (
        <div
          key={index}
          className={`mb-2 ${isBold ? "font-semibold text-foreground text-base" : "text-muted-foreground leading-relaxed"}`}
        >
          {processedLine}
        </div>
      )
    })
  }

  if (!result) {
    return (
      <Card className="min-h-[400px] flex items-center justify-center border-dashed border-2 hover:border-primary/50 transition-colors duration-300">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            {promptType?.icon && <span className="text-2xl">{promptType.icon}</span>}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Ready to Generate Insights</h3>
            <p className="text-muted-foreground text-pretty">
              Configure your product and objective, then generate analysis for{" "}
              <span className="font-medium text-foreground">{promptType?.label}</span> targeting{" "}
              <span className="font-medium text-foreground">{selectedSegment}</span>
            </p>
          </div>
          <Button onClick={onGenerate} disabled={isGenerating} className="transition-all duration-300 hover:scale-105">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Analysis
              </>
            )}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom duration-700">
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {promptType?.icon && (
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-xl">{promptType.icon}</span>
                </div>
              )}
              <div>
                <CardTitle className="text-xl">{promptType?.label}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Analysis for <span className="font-medium text-foreground">{result.segment}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {result.isSample && (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
                >
                  Sample Data
                </Badge>
              )}
              <Badge variant="outline" className="font-mono text-xs">
                {result.product}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="text-sm leading-relaxed space-y-1">{formatAnalysisContent(result.analysis)}</div>
          </div>
          {result.message && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">{result.message}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
})
