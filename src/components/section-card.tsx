import type { ReactNode } from "react"

interface SectionCardProps {
  title: string
  description?: string
  icon: ReactNode
  step: number
  children: ReactNode
}

export function SectionCard({ title, description, icon, step, children }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:p-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
          {step}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-primary">{icon}</div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  )
}
