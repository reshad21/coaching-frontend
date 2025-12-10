import * as React from "react"
import { cn } from "@/lib/utils"

interface ScrollableTableContainerProps {
  children: React.ReactNode
  maxHeight?: string
  minWidth?: string
  className?: string
}

/**
 * A reusable scrollable container for tables
 * Provides both horizontal and vertical scrolling with styled scrollbars
 * 
 * @param maxHeight - Maximum height of the container (default: "500px")
 * @param minWidth - Minimum width of the table content (default: "1200px")
 * @param className - Additional classes for the outer container
 */
const ScrollableTableContainer = React.forwardRef<
  HTMLDivElement,
  ScrollableTableContainerProps
>(({ children, maxHeight = "500px", minWidth = "1200px", className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "border border-border rounded-lg overflow-hidden",
        className
      )}
    >
      <div
        className="overflow-auto scrollable-table"
        style={{ maxHeight }}
      >
        <div style={{ minWidth }}>
          {children}
        </div>
      </div>
    </div>
  )
})

ScrollableTableContainer.displayName = "ScrollableTableContainer"

export { ScrollableTableContainer }
