import type { JSX } from "react"

export function renderMarkdownContent(content: string): JSX.Element {
  // Convert HTML tags to proper JSX elements
  const processedContent = content
    // Convert <strong> tags to bold text
    .replace(/<strong>(.*?)<\/strong>/g, '<span class="font-semibold text-foreground">$1</span>')
    // Convert <br> tags to line breaks
    .replace(/<br\s*\/?>/g, "\n")
    // Convert <em> tags to italic
    .replace(/<em>(.*?)<\/em>/g, '<span class="italic">$1</span>')
    // Remove any remaining HTML tags for safety
    .replace(/<[^>]*>/g, "")
    // Convert newlines to proper line breaks
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n")

  return (
    <div className="whitespace-pre-line leading-relaxed">
      {processedContent.split("\n").map((line, index) => {
        // Check if line contains bold text markers
        if (line.includes("font-semibold")) {
          return (
            <div key={index} className="mb-2">
              {line.split(/(<span class="font-semibold text-foreground">.*?<\/span>)/g).map((part, partIndex) => {
                if (part.includes("font-semibold")) {
                  const boldText = part.replace(/<span class="font-semibold text-foreground">(.*?)<\/span>/, "$1")
                  return (
                    <span key={partIndex} className="font-semibold text-foreground">
                      {boldText}
                    </span>
                  )
                }
                return part
              })}
            </div>
          )
        }
        return line.trim() ? (
          <div key={index} className="mb-1">
            {line}
          </div>
        ) : null
      })}
    </div>
  )
}

// Alternative simpler function for plain text rendering
export function renderPlainText(content: string): string {
  return content
    .replace(/<strong>(.*?)<\/strong>/g, "$1")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<em>(.*?)<\/em>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .trim()
}
