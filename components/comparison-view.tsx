"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SEGMENTS, PROMPT_TYPES } from "@/lib/constants"
import { Download, Copy, ArrowLeftRight } from "@/components/simple-icons"
import { useState } from "react"

interface AnalysisResult {
  analysis: string
  segment: string
  promptType: string
  product: string
  objective: string
}

interface ComparisonViewProps {
  results: AnalysisResult[]
  selectedPromptType: string
}

export function ComparisonView({ results, selectedPromptType }: ComparisonViewProps) {
  const [compareSegments, setCompareSegments] = useState<string[]>([SEGMENTS[0], SEGMENTS[1]])
  const [copied, setCopied] = useState(false)

  const currentPromptType = PROMPT_TYPES.find((p) => p.id === selectedPromptType)

  const getResultForSegment = (segment: string) => {
    return results.find((r) => r.segment === segment && r.promptType === selectedPromptType)
  }

  const copyComparison = async () => {
    const comparisonText = compareSegments
      .map((segment) => {
        const result = getResultForSegment(segment)
        return `${segment}:\n${result?.analysis || "No analysis available"}\n\n`
      })
      .join("")

    const fullText = `${currentPromptType?.label} Comparison\n\n${comparisonText}`

    try {
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const downloadComparison = () => {
    const comparisonText = compareSegments
      .map((segment) => {
        const result = getResultForSegment(segment)
        return `${segment}:\n${result?.analysis || "No analysis available"}\n\n`
      })
      .join("")

    const fullText = `${currentPromptType?.label} Comparison\n\n${comparisonText}`

    const blob = new Blob([fullText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentPromptType?.label}-comparison.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatAnalysis = (text: string) => {
    const sections = text.split("\n\n").filter((section) => section.trim())
    return sections.map((section, index) => {
      const trimmedSection = section.trim()
      if (trimmedSection.match(/^\d+\./m) || trimmedSection.match(/^[-•]/m)) {
        const items = trimmedSection.split("\n").filter((item) => item.trim())
        return (
          <ul key={index} className="space-y-1 mb-4">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start gap-2 text-sm">
                <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>{item.replace(/^\d+\.\s*|^[-•]\s*/, "")}</span>
              </li>
            ))}
          </ul>
        )
      }
      return (
        <p key={index} className="mb-3 text-sm leading-relaxed">
          {trimmedSection}
        </p>
      )
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5" />
              Segment Comparison - {currentPromptType?.label}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={copyComparison}>
                {copied ? "Copied!" : <Copy className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="outline" onClick={downloadComparison}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Compare Segment 1</label>
              <Select
                value={compareSegments[0]}
                onValueChange={(value) => setCompareSegments([value, compareSegments[1]])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEGMENTS.map((segment) => (
                    <SelectItem key={segment} value={segment}>
                      {segment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Compare Segment 2</label>
              <Select
                value={compareSegments[1]}
                onValueChange={(value) => setCompareSegments([compareSegments[0], value])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEGMENTS.map((segment) => (
                    <SelectItem key={segment} value={segment}>
                      {segment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {compareSegments.map((segment, index) => {
              const result = getResultForSegment(segment)
              return (
                <div key={segment} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{segment}</h3>
                    {result ? <Badge variant="secondary">Complete</Badge> : <Badge variant="outline">No Data</Badge>}
                  </div>
                  <Separator />
                  <div className="min-h-[300px]">
                    {result ? (
                      <div className="text-foreground">{formatAnalysis(result.analysis)}</div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <p className="text-sm">No analysis available for this segment</p>
                        <p className="text-xs mt-1">Generate analysis to see comparison</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
