"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "@/components/sidebar"
import { ProductSelector } from "@/components/product-selector"
import { SegmentOverview } from "@/components/segment-overview"
import { AnalysisGrid } from "@/components/analysis-grid"
import { AnalysisDetail } from "@/components/analysis-detail"
import { ComparisonView } from "@/components/comparison-view"
import { ExportPanel } from "@/components/export-panel"
import { LoadingSkeleton, GridLoadingSkeleton } from "@/components/loading-skeleton"
import { SEGMENTS, PROMPT_TYPES } from "@/lib/constants"
import { Loader2, Sparkles, LayoutGrid, Eye, ArrowLeftRight, Download, Zap } from "@/components/simple-icons"

interface AnalysisResult {
  analysis: string
  segment: string
  promptType: string
  product: string
  objective: string
  isSample?: boolean
  message?: string
}

export default function SWOTAnalyzer() {
  const [product, setProduct] = useState("")
  const [objective, setObjective] = useState("")
  const [selectedSegment, setSelectedSegment] = useState(SEGMENTS[0])
  const [selectedPromptType, setSelectedPromptType] = useState(PROMPT_TYPES[0].id)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("analysis")
  const [customSegments, setCustomSegments] = useState<string[]>([])
  const { toast } = useToast()

  const addCustomSegment = (segment: string) => {
    setCustomSegments((prev) => [...prev, segment])
  }

  const removeCustomSegment = (segment: string) => {
    setCustomSegments((prev) => prev.filter((s) => s !== segment))
    if (selectedSegment === segment) {
      setSelectedSegment(SEGMENTS[0])
    }
  }

  const generateAnalysis = async (promptType?: string) => {
    if (!product || !objective) return

    const targetPromptType = promptType || selectedPromptType
    setSelectedPromptType(targetPromptType)
    setIsGenerating(true)

    try {
      console.log("[v0] Starting analysis generation for:", {
        product,
        objective,
        selectedSegment,
        selectedPromptType: targetPromptType,
      })

      const response = await fetch("/api/swot-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          objective,
          segment: selectedSegment,
          promptType: targetPromptType,
        }),
      })

      const result = await response.json()
      console.log("[v0] API response received:", {
        status: response.status,
        hasAnalysis: !!result.analysis,
        isSample: result.isSample,
      })

      if (response.ok && result.analysis) {
        setResults((prev) => [
          result,
          ...prev.filter((r) => !(r.segment === selectedSegment && r.promptType === targetPromptType)),
        ])

        console.log("[v0] Analysis generated successfully:", result.usage || "sample data")

        toast({
          title: result.isSample ? "Sample Analysis Generated" : "Analysis Generated",
          description: result.isSample
            ? "High-quality sample analysis provided. Full AI analysis will be available when API access is restored."
            : "AI-powered analysis completed successfully.",
          duration: result.isSample ? 4000 : 3000,
        })
      } else {
        throw new Error(result.error || "Failed to generate analysis")
      }
    } catch (error) {
      console.error("[v0] Failed to generate analysis:", error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Unable to generate analysis. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const generateAllForSegment = async () => {
    if (!product || !objective) return

    setIsGenerating(true)
    let successCount = 0
    let sampleCount = 0

    try {
      console.log("[v0] Starting batch generation for:", selectedSegment)

      for (const promptType of PROMPT_TYPES) {
        try {
          const response = await fetch("/api/swot-analysis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product,
              objective,
              segment: selectedSegment,
              promptType: promptType.id,
            }),
          })

          const result = await response.json()

          if (response.ok && result.analysis) {
            setResults((prev) => [
              result,
              ...prev.filter((r) => !(r.segment === selectedSegment && r.promptType === promptType.id)),
            ])
            successCount++
            if (result.isSample) sampleCount++
            console.log("[v0] Generated analysis for:", promptType.id, result.isSample ? "(sample)" : "(AI)")
          } else {
            console.error("[v0] Failed to generate for:", promptType.id, result.error)
          }
        } catch (error) {
          console.error("[v0] Error generating for:", promptType.id, error)
        }
      }

      if (successCount > 0) {
        const message =
          sampleCount > 0
            ? `Generated ${successCount} analyses (${sampleCount} sample, ${successCount - sampleCount} AI) for ${selectedSegment}.`
            : `Successfully generated ${successCount} AI analyses for ${selectedSegment}.`

        toast({
          title: "Batch Analysis Complete",
          description: message,
          duration: 4000,
        })
      } else {
        throw new Error("Failed to generate any analyses")
      }
    } catch (error) {
      console.error("[v0] Batch generation failed:", error)
      toast({
        title: "Batch Generation Failed",
        description: "Unable to complete batch analysis. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleViewFullAnalysis = (promptType: string) => {
    setSelectedPromptType(promptType)
    setActiveTab("analysis")
  }

  const currentResult = results.find((r) => r.segment === selectedSegment && r.promptType === selectedPromptType)

  return (
    <div className="min-h-screen bg-background flex performance-optimized">
      <Sidebar
        selectedSegment={selectedSegment}
        selectedPromptType={selectedPromptType}
        onSegmentChange={setSelectedSegment}
        onPromptTypeChange={setSelectedPromptType}
        isGenerating={isGenerating}
        customSegments={customSegments}
        onAddCustomSegment={addCustomSegment}
        onRemoveCustomSegment={removeCustomSegment}
      />

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-top duration-1000">
            <div className="relative">
              <h1 className="text-5xl font-bold text-balance leading-tight">
                <span className="text-gradient animate-shimmer bg-gradient-to-r from-primary via-accent to-chart-3 bg-[length:200%_100%] bg-clip-text text-transparent font-black">
                  Subconscious.ai
                </span>
                <br />
                <span className="text-3xl text-foreground font-light">SWOT Explorer</span>
              </h1>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-ping opacity-75" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed">
              Generate AI-powered insights across customer segments with{" "}
              <span className="text-accent font-medium">intelligent analysis</span> and{" "}
              <span className="text-primary font-medium">strategic depth</span>
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
            <ProductSelector
              product={product}
              objective={objective}
              onProductChange={setProduct}
              onObjectiveChange={setObjective}
            />
          </div>

          <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            <SegmentOverview results={results} selectedSegment={selectedSegment} onSegmentChange={setSelectedSegment} />
          </div>

          <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom duration-1000 delay-400">
            <div className="flex gap-4">
              <Button
                onClick={() => generateAnalysis()}
                disabled={!product || !objective || isGenerating}
                size="lg"
                className="glass-effect hover-lift bg-primary/10 border-primary/30 hover:bg-primary hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="animate-shimmer bg-gradient-to-r from-primary-foreground via-accent-foreground to-primary-foreground bg-[length:200%_100%] bg-clip-text text-transparent">
                      Generating...
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                    Generate Current
                  </>
                )}
              </Button>

              <Button
                onClick={generateAllForSegment}
                disabled={!product || !objective || isGenerating}
                variant="outline"
                size="lg"
                className="glass-effect hover-lift border-accent/30 hover:border-accent hover:bg-accent/10 hover:text-accent transition-all duration-300 bg-transparent"
              >
                <Zap className="mr-2 h-4 w-4 animate-pulse" />
                Generate All for {selectedSegment}
              </Button>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 glass-effect backdrop-blur-glass border border-border/50">
                <TabsTrigger
                  value="analysis"
                  className="flex items-center gap-2 transition-all duration-300 hover:bg-accent/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <Eye className="w-4 h-4" />
                  Analysis
                </TabsTrigger>
                <TabsTrigger
                  value="grid"
                  className="flex items-center gap-2 transition-all duration-300 hover:bg-accent/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <LayoutGrid className="w-4 h-4" />
                  Grid View
                </TabsTrigger>
                <TabsTrigger
                  value="compare"
                  className="flex items-center gap-2 transition-all duration-300 hover:bg-accent/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  Compare
                </TabsTrigger>
                <TabsTrigger
                  value="export"
                  className="flex items-center gap-2 transition-all duration-300 hover:bg-accent/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <Download className="w-4 h-4" />
                  Export
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analysis" className="mt-6 performance-optimized">
                {isGenerating && activeTab === "analysis" ? (
                  <LoadingSkeleton />
                ) : (
                  <AnalysisDetail
                    result={currentResult}
                    selectedSegment={selectedSegment}
                    selectedPromptType={selectedPromptType}
                    onGenerate={() => generateAnalysis()}
                    isGenerating={isGenerating}
                  />
                )}
              </TabsContent>

              <TabsContent value="grid" className="mt-6 performance-optimized">
                {isGenerating && activeTab === "grid" ? (
                  <GridLoadingSkeleton />
                ) : (
                  <AnalysisGrid
                    results={results}
                    selectedSegment={selectedSegment}
                    onPromptTypeChange={setSelectedPromptType}
                    selectedPromptType={selectedPromptType}
                    product={product}
                    objective={objective}
                    onGenerate={generateAnalysis}
                    isGenerating={isGenerating}
                    onViewFullAnalysis={handleViewFullAnalysis}
                  />
                )}
              </TabsContent>

              <TabsContent value="compare" className="mt-6 performance-optimized">
                <ComparisonView results={results} selectedPromptType={selectedPromptType} />
              </TabsContent>

              <TabsContent value="export" className="mt-6 performance-optimized">
                <ExportPanel results={results} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
