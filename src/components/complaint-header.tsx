import React from "react"

export function ComplaintHeader() {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-8 shadow-sm md:px-12 md:py-10">
      {/* Subtle decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="currentColor" />
          </pattern>
          <rect fill="url(#dots)" width="100%" height="100%" />
        </svg>
      </div>

      {/* Accent line at top */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-transparent" />

      <div className="relative flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex flex-col items-center gap-5 md:flex-row">
          {/* Book icon badge */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
              <path d="M8 11h8" />
              <path d="M8 7h6" />
            </svg>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-card-foreground md:text-3xl text-balance">
              Libro de Reclamaciones
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Conforme al D.S. N 042-2011/PC y sus modificatorias
            </p>
          </div>
        </div>

        {/* Mascot */}
        <img
          src="/images/mascot-large.svg"
          alt="Mascota del libro de reclamaciones"
          width={110}
          height={115}
          className="drop-shadow-sm"
        />
      </div>
    </header>
  )
}
