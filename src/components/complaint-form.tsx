import React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SectionCard } from "./section-card"
import { FormField } from "./form-field"
import { ComplaintHeader } from "./complaint-header"
import { SuccessMessage } from "./success-message"

// Icons as components
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}

export function ComplaintForm() {
  const [submitted, setSubmitted] = useState(false)
  const [complaintType, setComplaintType] = useState("")
  const [documentType, setDocumentType] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [subscriptionPlan, setSubscriptionPlan] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [numeroExpediente, setNumeroExpediente] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles(filesArray)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Agregar archivos si existen
      selectedFiles.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/complaints', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al enviar la reclamación')
      }

      // Guardar el número de expediente para mostrarlo
      setNumeroExpediente(result.data.complaint.numero_expediente)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la reclamación')
      console.error('Error submitting complaint:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return <SuccessMessage onReset={() => {
      setSubmitted(false)
      setNumeroExpediente("")
      setSelectedFiles([])
    }} numeroExpediente={numeroExpediente} />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <ComplaintHeader />

      {/* Info banner */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-secondary/50 bg-secondary/10 p-4">
        <div className="mt-0.5 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary-foreground">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
        <p className="text-sm leading-relaxed text-secondary-foreground">
          Complete todos los campos obligatorios marcados con <span className="font-semibold text-primary">*</span>. Su reclamo sera atendido en un plazo maximo de 30 dias calendario.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/50 bg-destructive/10 p-4">
          <div className="mt-0.5 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-sm leading-relaxed text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Section 1: Personal Data */}
        <SectionCard
          step={1}
          title="Datos del Consumidor"
          description="Informacion personal del reclamante"
          icon={<UserIcon />}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Nombres" htmlFor="nombres" required>
              <Input id="nombres" name="nombres" placeholder="Ingrese sus nombres" required className="bg-background" />
            </FormField>
            <FormField label="Apellidos" htmlFor="apellidos" required>
              <Input id="apellidos" name="apellidos" placeholder="Ingrese sus apellidos" required className="bg-background" />
            </FormField>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Tipo de Documento" htmlFor="tipo-doc" required>
              <Select value={documentType} onValueChange={setDocumentType} name="tipo_documento" required>
                <SelectTrigger id="tipo-doc" className="bg-background">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dni">DNI</SelectItem>
                  <SelectItem value="ce">Carnet de Extranjeria</SelectItem>
                  <SelectItem value="pasaporte">Pasaporte</SelectItem>
                  <SelectItem value="ruc">RUC</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="tipo_documento" value={documentType} />
            </FormField>
            <FormField label="Numero de Documento" htmlFor="num-doc" required>
              <Input id="num-doc" name="numero_documento" placeholder="Ej: 12345678" required className="bg-background" />
            </FormField>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Correo Electronico" htmlFor="email" required>
              <Input id="email" name="email" type="email" placeholder="correo@ejemplo.com" required className="bg-background" />
            </FormField>
            <FormField label="Telefono" htmlFor="telefono" required>
              <Input id="telefono" name="telefono" type="tel" placeholder="+51 999 999 999" required className="bg-background" />
            </FormField>
          </div>

          <FormField label="Direccion" htmlFor="direccion" required>
            <Input id="direccion" name="direccion" placeholder="Ingrese su direccion completa" required className="bg-background" />
          </FormField>

          <div className="grid gap-5 md:grid-cols-3">
            <FormField label="Departamento" htmlFor="departamento">
              <Select name="departamento">
                <SelectTrigger id="departamento" className="bg-background">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lima">Lima</SelectItem>
                  <SelectItem value="arequipa">Arequipa</SelectItem>
                  <SelectItem value="cusco">Cusco</SelectItem>
                  <SelectItem value="la-libertad">La Libertad</SelectItem>
                  <SelectItem value="piura">Piura</SelectItem>
                  <SelectItem value="lambayeque">Lambayeque</SelectItem>
                  <SelectItem value="junin">Junin</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Provincia" htmlFor="provincia">
              <Input id="provincia" name="provincia" placeholder="Provincia" className="bg-background" />
            </FormField>
            <FormField label="Distrito" htmlFor="distrito">
              <Input id="distrito" name="distrito" placeholder="Distrito" className="bg-background" />
            </FormField>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Empresa / Razon Social" htmlFor="empresa">
              <Input id="empresa" name="empresa" placeholder="Nombre de su empresa" className="bg-background" />
            </FormField>
            <FormField label="RUC de la Empresa" htmlFor="ruc-empresa">
              <Input id="ruc-empresa" name="ruc_empresa" placeholder="Ej: 20123456789" className="bg-background" />
            </FormField>
          </div>
        </SectionCard>

        {/* Section 2: Complaint Details - adapted for ERP subscription */}
        <SectionCard
          step={2}
          title="Detalle de la Reclamacion"
          description="Tipo y descripcion del reclamo sobre el servicio ERP"
          icon={<AlertIcon />}
        >
          {/* Complaint type selection */}
          <FormField label="Tipo de Reclamacion" htmlFor="tipo-reclamo" required>
            <RadioGroup
              value={complaintType}
              onValueChange={setComplaintType}
              className="grid gap-3 md:grid-cols-2"
            >
              <label
                htmlFor="reclamo"
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${
                  complaintType === "reclamo"
                    ? "border-primary bg-accent"
                    : "border-border bg-background hover:border-primary/30"
                }`}
              >
                <RadioGroupItem value="reclamo" id="reclamo" className="mt-0.5" />
                <div>
                  <span className="font-semibold text-card-foreground">Reclamo</span>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Disconformidad con el servicio de suscripcion ERP contratado.
                  </p>
                </div>
              </label>
              <label
                htmlFor="queja"
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${
                  complaintType === "queja"
                    ? "border-primary bg-accent"
                    : "border-border bg-background hover:border-primary/30"
                }`}
              >
                <RadioGroupItem value="queja" id="queja" className="mt-0.5" />
                <div>
                  <span className="font-semibold text-card-foreground">Queja</span>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Malestar o descontento respecto a la atencion recibida.
                  </p>
                </div>
              </label>
            </RadioGroup>
            <input type="hidden" name="tipo_reclamacion" value={complaintType} />
          </FormField>

          {/* Subscription info */}
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Plan de Suscripcion" htmlFor="plan" required>
              <Select value={subscriptionPlan} onValueChange={setSubscriptionPlan} required>
                <SelectTrigger id="plan" className="bg-background">
                  <SelectValue placeholder="Seleccione su plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basico">Plan Basico</SelectItem>
                  <SelectItem value="profesional">Plan Profesional</SelectItem>
                  <SelectItem value="empresarial">Plan Empresarial</SelectItem>
                  <SelectItem value="personalizado">Plan Personalizado</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="plan_suscripcion" value={subscriptionPlan} />
            </FormField>
            <FormField label="Fecha del Incidente" htmlFor="fecha-incidente" required>
              <Input id="fecha-incidente" name="fecha_incidente" type="date" required className="bg-background" />
            </FormField>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Modulo Afectado" htmlFor="modulo">
              <Select name="modulo_afectado">
                <SelectTrigger id="modulo" className="bg-background">
                  <SelectValue placeholder="Seleccione el modulo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facturacion">Facturacion</SelectItem>
                  <SelectItem value="inventario">Inventario</SelectItem>
                  <SelectItem value="contabilidad">Contabilidad</SelectItem>
                  <SelectItem value="rrhh">Recursos Humanos</SelectItem>
                  <SelectItem value="ventas">Ventas</SelectItem>
                  <SelectItem value="compras">Compras</SelectItem>
                  <SelectItem value="reportes">Reportes</SelectItem>
                  <SelectItem value="configuracion">Configuracion</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="space-y-5">
            <FormField label="Detalle de la Reclamacion" htmlFor="detalle" required>
              <Textarea
                id="detalle"
                name="detalle_reclamacion"
                placeholder="Describa con detalle lo sucedido: que funcionalidad fallo, que error aparecio, como afecto su operacion, etc."
                rows={5}
                required
                className="bg-background resize-none"
              />
            </FormField>

            <FormField label="Solucion Esperada" htmlFor="pedido" required>
              <Textarea
                id="pedido"
                name="solucion_esperada"
                placeholder="Indique la solucion que espera: reembolso, correccion del servicio, compensacion, etc."
                rows={3}
                required
                className="bg-background resize-none"
              />
            </FormField>
          </div>
        </SectionCard>

        {/* Section 3: Additional Info */}
        <SectionCard
          step={3}
          title="Informacion Adicional"
          description="Archivos adjuntos y observaciones"
          icon={<FileTextIcon />}
        >
          <FormField label="Adjuntar Evidencia (opcional)" htmlFor="evidencia">
            <div className="space-y-3">
              <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-background px-6 py-8 transition-colors hover:border-primary/40">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-muted-foreground">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                  <p className="mt-2 text-sm font-medium text-card-foreground">
                    Arrastre capturas de pantalla u otros archivos aqui
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PDF, JPG, PNG hasta 10MB
                  </p>
                  <input
                    id="evidencia"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                    multiple
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 bg-transparent"
                    onClick={() => document.getElementById("evidencia")?.click()}
                  >
                    Seleccionar Archivos
                  </Button>
                </div>
              </div>
              
              {/* Lista de archivos seleccionados */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Archivos seleccionados:</p>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 ml-2 shrink-0"
                        onClick={() => removeFile(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormField>

          <FormField label="Observaciones Adicionales" htmlFor="observaciones">
            <Textarea
              id="observaciones"
              name="observaciones"
              placeholder="Cualquier informacion adicional que desee agregar sobre su experiencia con el software..."
              rows={3}
              className="bg-background resize-none"
            />
          </FormField>
        </SectionCard>

        {/* Terms and Submit */}
        <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terminos"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              className="mt-0.5"
            />
            <Label htmlFor="terminos" className="text-sm leading-relaxed text-card-foreground cursor-pointer">
              Declaro que la informacion proporcionada es veraz y me comprometo a probar lo alegado, conforme a la normativa vigente de proteccion al consumidor. Acepto los{" "}
              <a href="#" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
                terminos y condiciones
              </a>{" "}
              y la{" "}
              <a href="#" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
                politica de privacidad
              </a>.
            </Label>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Sus datos estan protegidos</span>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={!acceptedTerms || isSubmitting}
              className="w-full gap-2 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <SendIcon />
                  Enviar Reclamacion
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Footer */}
      <footer className="mt-8 flex flex-col items-center gap-4 text-center">
        <img
          src="/images/mascot-large.svg"
          alt="Mascota decorativa"
          width={50}
          height={52}
          className="opacity-60"
        />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Este formulario cumple con la Ley N 29571, Codigo de Proteccion y Defensa del Consumidor,
          y el Decreto Supremo N 042-2011/PC. Los datos seran tratados de acuerdo a la Ley N 29733 de Proteccion de Datos Personales.
        </p>
      </footer>
    </div>
  )
}
