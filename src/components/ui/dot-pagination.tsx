import * as React from "react"
import { cn } from "cn"

export interface DotPaginationProps extends React.ComponentProps<"div"> {
  activeIndex?: number
  activeDotClassName?: string
  dotClassName?: string
  total?: number
}

export const DotPagination = ({
  activeIndex = 0,
  activeDotClassName,
  className,
  dotClassName,
  total = 3,
  ...props
}: DotPaginationProps) => {
  return (
    <div
      role="tablist"
      aria-label="Progress pagination"
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    >
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex

        return (
          <span
            key={index}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-all duration-300",
              isActive
                ? cn(
                    "scale-115 bg-[#c084fc] shadow-[0_0_10px_rgba(192,132,252,0.8)]",
                    activeDotClassName
                  )
                : cn("bg-white/20", dotClassName)
            )}
          />
        )
      })}
    </div>
  )
}

DotPagination.displayName = "DotPagination"

export default DotPagination
