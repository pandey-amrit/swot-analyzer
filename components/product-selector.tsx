"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PRODUCTS, OBJECTIVES } from "@/lib/constants"
import { Plus, X } from "@/components/simple-icons"

interface ProductSelectorProps {
  product: string
  objective: string
  onProductChange: (product: string) => void
  onObjectiveChange: (objective: string) => void
}

export function ProductSelector({ product, objective, onProductChange, onObjectiveChange }: ProductSelectorProps) {
  const [customProduct, setCustomProduct] = useState("")
  const [customObjective, setCustomObjective] = useState("")
  const [showCustomProduct, setShowCustomProduct] = useState(false)
  const [showCustomObjective, setShowCustomObjective] = useState(false)

  const handleAddCustomProduct = () => {
    if (customProduct.trim()) {
      onProductChange(customProduct.trim())
      setCustomProduct("")
      setShowCustomProduct(false)
    }
  }

  const handleAddCustomObjective = () => {
    if (customObjective.trim()) {
      onObjectiveChange(customObjective.trim())
      setCustomObjective("")
      setShowCustomObjective(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product & Objective Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-medium">Select Product</Label>
          <div className="flex flex-wrap gap-2">
            {PRODUCTS.map((p) => (
              <Badge
                key={p}
                variant={product === p ? "default" : "secondary"}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-accent transition-colors"
                onClick={() => onProductChange(p)}
              >
                {p}
              </Badge>
            ))}
            <Badge
              variant="outline"
              className="cursor-pointer px-3 py-2 text-sm hover:bg-accent transition-colors"
              onClick={() => setShowCustomProduct(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              Custom
            </Badge>
          </div>

          {showCustomProduct && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Enter custom product..."
                value={customProduct}
                onChange={(e) => setCustomProduct(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomProduct()}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddCustomProduct}>
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowCustomProduct(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {product && !PRODUCTS.includes(product) && (
            <div className="flex items-center gap-2">
              <Badge variant="default" className="px-3 py-2">
                {product}
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => onProductChange("")}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Business Objective</Label>
          <div className="flex flex-wrap gap-2">
            {OBJECTIVES.map((o) => (
              <Badge
                key={o}
                variant={objective === o ? "default" : "secondary"}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-accent transition-colors"
                onClick={() => onObjectiveChange(o)}
              >
                {o}
              </Badge>
            ))}
            <Badge
              variant="outline"
              className="cursor-pointer px-3 py-2 text-sm hover:bg-accent transition-colors"
              onClick={() => setShowCustomObjective(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              Custom
            </Badge>
          </div>

          {showCustomObjective && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Enter custom objective..."
                value={customObjective}
                onChange={(e) => setCustomObjective(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomObjective()}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddCustomObjective}>
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowCustomObjective(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {objective && !OBJECTIVES.includes(objective) && (
            <div className="flex items-center gap-2">
              <Badge variant="default" className="px-3 py-2">
                {objective}
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => onObjectiveChange("")}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
