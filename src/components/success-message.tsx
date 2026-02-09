import React from "react"
import { Button } from "./ui/button"

interface SuccessMessageProps {
  onReset: () => void
}

export function SuccessMessage({ onReset }: SuccessMessageProps) {
  const claimNumber = `REC-${Date.now().toString().slice(-8)}`

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm md:p-12">
        {/* Success animation circle */}
        <div className="relative mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50 ring-4 ring-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div className="absolute -bottom-2 -right-4">
            <img
              src="/images/mascot-large.svg"
              alt="Mascota celebrando"
              width={60}
              height={63}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-card-foreground md:text-3xl text-balance">
          Reclamacion Registrada
        </h2>

        <div className="mt-4 rounded-xl bg-accent px-6 py-3">
          <p className="text-sm text-muted-foreground">Numero de reclamo</p>
          <p className="text-lg font-bold tracking-wider text-primary">{claimNumber}</p>
        </div>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
          Hemos recibido su reclamacion sobre nuestro servicio de software ERP. Sera atendida en un plazo maximo de
          <strong className="text-card-foreground"> 30 dias calendario</strong>. Recibira una notificacion al correo
          electronico proporcionado con el seguimiento de su caso.
        </p>

        <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => window.print()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect width="12" height="8" x="6" y="14" />
            </svg>
            Imprimir Constancia
          </Button>
          <Button className="gap-2" onClick={onReset}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Nueva Reclamacion
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Registrado el {new Date().toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    </div>
  )
}
