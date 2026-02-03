import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  error?: string
  label?: string
  helpText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon: Icon, error, label, helpText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
           <label className="block text-sm font-medium text-slate-700 mb-1.5">
             {label}
           </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2463eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm",
              Icon && "pl-10",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? "input-error" : undefined}
            {...props}
          />
        </div>
        
        {helpText && (
          <p className="mt-1.5 text-xs text-slate-500">{helpText}</p>
        )}
        
        {error && (
          <p id="input-error" className="mt-1.5 text-xs text-red-500 font-medium" role="alert">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
