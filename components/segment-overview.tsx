"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/animated-counter"
import { SEGMENTS, PROMPT_TYPES } from "@/lib/constants"
import { CheckCircle, Circle, TrendingUp } from "@/components/simple-icons"

interface AnalysisResult {
  analysis: string
  segment: string
  promptType: string
  product: string
  objective: string
}

interface SegmentOverviewProps {
  results: AnalysisResult[]
  selectedSegment: string
  onSegmentChange: (segment: string) => void
}

export const SegmentOverview = React.memo(function SegmentOverview({
  results,
  selectedSegment,
  onSegmentChange,
}: SegmentOverviewProps) {
  const getCompletionStatus = React.useCallback(
    (segment: string) => {
      const segmentResults = results.filter((r) => r.segment === segment)
      const completed = segmentResults.length
      const total = PROMPT_TYPES.length
      return { completed, total, percentage: Math.round((completed / total) * 100) }
    },
    [results],
  )

  const totalCompleted = React.useMemo(() => results.length, [results])
  const totalPossible = React.useMemo(() => SEGMENTS.length * PROMPT_TYPES.length, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Analyses</p>
                <p className="text-2xl font-bold">
                  <AnimatedCounter value={totalCompleted} />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">
                  <AnimatedCounter value={Math.round((totalCompleted / totalPossible) * 100)} suffix="%" />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-chart-3/20 rounded-lg flex items-center justify-center">
                <Circle className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Segments Active</p>
                <p className="text-2xl font-bold">
                  <AnimatedCounter value={SEGMENTS.filter((s) => results.some((r) => r.segment === s)).length} />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Segment Analysis Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEGMENTS.map((segment, index) => {
              const status = getCompletionStatus(segment)
              const isSelected = selectedSegment === segment

              return (
                <div
                  key={segment}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:bg-accent/50 hover:scale-[1.02] hover:shadow-md ${
                    isSelected ? "border-primary bg-accent/20 shadow-lg scale-[1.02]" : "border-border"
                  }`}
                  onClick={() => onSegmentChange(segment)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm leading-tight">{segment}</h3>
                    <div className="transition-all duration-300">
                      {status.completed > 0 ? (
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 animate-in fade-in duration-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        <AnimatedCounter value={status.completed} />/{status.total} completed
                      </span>
                      <span>
                        <AnimatedCounter value={status.percentage} suffix="%" />
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${status.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
})
