"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SEGMENTS, PROMPT_TYPES } from "@/lib/constants"
import { Download, FileText, Table, Mail } from "@/components/simple-icons"
import { useState } from "react"

interface AnalysisResult {
  analysis: string
  segment: string
  promptType: string
  product: string
  objective: string
}

interface ExportPanelProps {
  results: AnalysisResult[]
}

export function ExportPanel({ results }: ExportPanelProps) {
  const [selectedSegments, setSelectedSegments] = useState<string[]>(SEGMENTS)
  const [selectedPromptTypes, setSelectedPromptTypes] = useState<string[]>(PROMPT_TYPES.map((p) => p.id))
  const [exportFormat, setExportFormat] = useState<"txt" | "csv" | "json">("txt")

  const toggleSegment = (segment: string) => {
    setSelectedSegments((prev) => (prev.includes(segment) ? prev.filter((s) => s !== segment) : [...prev, segment]))
  }

  const togglePromptType = (promptType: string) => {
    setSelectedPromptTypes((prev) =>
      prev.includes(promptType) ? prev.filter((p) => p !== promptType) : [...prev, promptType],
    )
  }

  const getFilteredResults = () => {
    return results.filter(
      (result) => selectedSegments.includes(result.segment) && selectedPromptTypes.includes(result.promptType),
    )
  }

  const exportAsText = () => {
    const filteredResults = getFilteredResults()
    let content = "SWOT Analysis Export\n"
    content += "===================\n\n"

    if (filteredResults.length > 0) {
      content += `Product: ${filteredResults[0].product}\n`
      content += `Objective: ${filteredResults[0].objective}\n\n`
    }

    selectedSegments.forEach((segment) => {
      content += `${segment}\n`
      content += "-".repeat(segment.length) + "\n\n"

      selectedPromptTypes.forEach((promptTypeId) => {
        const promptType = PROMPT_TYPES.find((p) => p.id === promptTypeId)
        const result = filteredResults.find((r) => r.segment === segment && r.promptType === promptTypeId)

        content += `${promptType?.label}:\n`
        content += result ? result.analysis : "No analysis available"
        content += "\n\n"
      })
      content += "\n"
    })

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "swot-analysis-export.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportAsCSV = () => {
    const filteredResults = getFilteredResults()
    let csv = "Segment,Analysis Type,Product,Objective,Analysis\n"

    filteredResults.forEach((result) => {
      const promptType = PROMPT_TYPES.find((p) => p.id === result.promptType)
      const escapedAnalysis = result.analysis.replace(/"/g, '""').replace(/\n/g, " ")
      csv += `"${result.segment}","${promptType?.label}","${result.product}","${result.objective}","${escapedAnalysis}"\n`
    })

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "swot-analysis-export.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportAsJSON = () => {
    const filteredResults = getFilteredResults()
    const exportData = {
      exportDate: new Date().toISOString(),
      totalResults: filteredResults.length,
      results: filteredResults.map((result) => ({
        ...result,
        promptTypeLabel: PROMPT_TYPES.find((p) => p.id === result.promptType)?.label,
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "swot-analysis-export.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExport = () => {
    switch (exportFormat) {
      case "txt":
        exportAsText()
        break
      case "csv":
        exportAsCSV()
        break
      case "json":
        exportAsJSON()
        break
    }
  }

  const filteredResults = getFilteredResults()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Select Segments</h4>
            <div className="grid grid-cols-2 gap-2">
              {SEGMENTS.map((segment) => (
                <div key={segment} className="flex items-center space-x-2">
                  <Checkbox
                    id={`segment-${segment}`}
                    checked={selectedSegments.includes(segment)}
                    onCheckedChange={() => toggleSegment(segment)}
                  />
                  <label htmlFor={`segment-${segment}`} className="text-sm">
                    {segment}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Select Analysis Types</h4>
            <div className="grid grid-cols-2 gap-2">
              {PROMPT_TYPES.map((promptType) => (
                <div key={promptType.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`prompt-${promptType.id}`}
                    checked={selectedPromptTypes.includes(promptType.id)}
                    onCheckedChange={() => togglePromptType(promptType.id)}
                  />
                  <label htmlFor={`prompt-${promptType.id}`} className="text-sm">
                    {promptType.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Export Format</h4>
            <Select value={exportFormat} onValueChange={(value: "txt" | "csv" | "json") => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="txt">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Text File (.txt)
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4" />
                    CSV File (.csv)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    JSON File (.json)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">{filteredResults.length} results selected for export</div>
          </div>
          <Button onClick={handleExport} disabled={filteredResults.length === 0} className="w-full" size="lg">
            <Download className="w-4 h-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
