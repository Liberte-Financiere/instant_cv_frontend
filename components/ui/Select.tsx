import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, LucideIcon } from "lucide-react"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon?: LucideIcon
  error?: string
  label?: string
  helpText?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, icon: Icon, error, label, helpText, children, ...props }, ref) => {
    return (
      <div className="w-full">
         {label && (
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              {label}
            </label>
         )}
         <div className="relative">
            {Icon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <select
              className={cn(
                "flex h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2463eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm",
                 Icon ? "pl-10" : "",
                 "pr-10", // Space for chevron
                 error && "border-red-500 focus-visible:ring-red-500",
                className
              )}
              ref={ref}
              aria-invalid={!!error}
              {...props}
            >
              {children}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <ChevronDown className="h-4 w-4" />
            </div>
         </div>
         {helpText && (
            <p className="mt-1.5 text-xs text-slate-500">{helpText}</p>
          )}
          {error && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
          )}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
