import { createClient } from '@supabase/supabase-js'


const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getServiceSupabase() {
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export interface Complaint {
  id?: string
  created_at?: string
  updated_at?: string
  
  nombres: string
  apellidos: string
  tipo_documento: string
  numero_documento: string
  email: string
  telefono: string
  direccion: string
  departamento?: string
  provincia?: string
  distrito?: string
  empresa?: string
  ruc_empresa?: string
  
  tipo_reclamacion: 'reclamo' | 'queja'
  
  plan_suscripcion: string
  fecha_incidente: string
  modulo_afectado?: string
  detalle_reclamacion: string
  solucion_esperada: string
  
  observaciones?: string
  
  estado?: 'pendiente' | 'en_proceso' | 'resuelto' | 'cerrado'
  numero_expediente?: string
  

  respuesta?: string
  fecha_respuesta?: string
  respondido_por?: string
}

export interface ComplaintAttachment {
  id?: string
  created_at?: string
  complaint_id: string
  file_name: string
  file_type: string
  file_size: number
  file_url: string
  s3_key: string
  uploaded_by?: string
}
