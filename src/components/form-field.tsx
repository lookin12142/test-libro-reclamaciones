import type { ReactNode } from "react"
import { Label } from "./ui/label"

interface FormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  children: ReactNode
}

export function FormField({ label, htmlFor, required = false, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-card-foreground">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </Label>
      {children}
    </div>
  )
}
