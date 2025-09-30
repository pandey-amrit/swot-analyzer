"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SEGMENTS, PROMPT_TYPES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Plus, X } from "@/components/simple-icons"
import { useState } from "react"

interface SidebarProps {
  selectedSegment: string
  selectedPromptType: string
  onSegmentChange: (segment: string) => void
  onPromptTypeChange: (promptType: string) => void
  isGenerating: boolean
  customSegments: string[]
  onAddCustomSegment: (segment: string) => void
  onRemoveCustomSegment: (segment: string) => void
}

export function Sidebar({
  selectedSegment,
  selectedPromptType,
  onSegmentChange,
  onPromptTypeChange,
  isGenerating,
  customSegments,
  onAddCustomSegment,
  onRemoveCustomSegment,
}: SidebarProps) {
  const [newSegment, setNewSegment] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const allSegments = [...SEGMENTS, ...customSegments]

  const handleAddSegment = () => {
    if (newSegment.trim() && !allSegments.includes(newSegment.trim())) {
      onAddCustomSegment(newSegment.trim())
      setNewSegment("")
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border p-6 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Customer Segments</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Segment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter segment name (e.g., 'Tech Entrepreneurs')"
                  value={newSegment}
                  onChange={(e) => setNewSegment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSegment()}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddSegment} disabled={!newSegment.trim()}>
                    Add Segment
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-2">
          {allSegments.map((segment) => {
            const isCustom = customSegments.includes(segment)
            return (
              <div key={segment} className="flex items-center gap-1">
                <Button
                  variant={selectedSegment === segment ? "default" : "ghost"}
                  className={cn(
                    "flex-1 justify-start text-left h-auto p-3",
                    selectedSegment === segment
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                  onClick={() => onSegmentChange(segment)}
                  disabled={isGenerating}
                >
                  {segment}
                </Button>
                {isCustom && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveCustomSegment(segment)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-sidebar-foreground mb-4">Analysis Types</h2>
        <div className="space-y-2">
          {PROMPT_TYPES.map((type) => (
            <Button
              key={type.id}
              variant={selectedPromptType === type.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start text-left h-auto p-3",
                selectedPromptType === type.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
              onClick={() => onPromptTypeChange(type.id)}
              disabled={isGenerating}
            >
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
