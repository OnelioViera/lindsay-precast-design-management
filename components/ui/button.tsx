import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border",
          {
            'bg-gray-700 text-white hover:bg-gray-800 border-gray-900': variant === 'primary',
            'bg-gray-500 text-white hover:bg-gray-600 border-gray-700': variant === 'secondary',
            'bg-red-600 text-white hover:bg-red-700 border-red-900': variant === 'destructive',
            'bg-gray-600 text-white hover:bg-gray-700 border-gray-800': variant === 'success',
            'bg-gray-400 text-gray-900 hover:bg-gray-500 border-gray-600': variant === 'warning',
            'bg-gray-300 text-gray-900 hover:bg-gray-400 border-gray-500': variant === 'default',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }


