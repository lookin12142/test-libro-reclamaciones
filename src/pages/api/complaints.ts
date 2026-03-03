import type { APIRoute } from 'astro'
import { getServiceSupabase, type Complaint } from '../../lib/supabase'
import { uploadFileToStorage, isValidFileType, isValidFileSize } from '../../lib/storage'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parsear el FormData
    const formData = await request.formData()
    
    // Extraer los datos del formulario
    const complaintData: Complaint = {
      // Datos del consumidor
      nombres: formData.get('nombres') as string,
      apellidos: formData.get('apellidos') as string,
      tipo_documento: formData.get('tipo_documento') as string,
      numero_documento: formData.get('numero_documento') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string,
      direccion: formData.get('direccion') as string,
      departamento: formData.get('departamento') as string || undefined,
      provincia: formData.get('provincia') as string || undefined,
      distrito: formData.get('distrito') as string || undefined,
      empresa: formData.get('empresa') as string || undefined,
      ruc_empresa: formData.get('ruc_empresa') as string || undefined,
      
      // Tipo de reclamación
      tipo_reclamacion: formData.get('tipo_reclamacion') as 'reclamo' | 'queja',
      
      // Detalle
      plan_suscripcion: formData.get('plan_suscripcion') as string,
      fecha_incidente: formData.get('fecha_incidente') as string,
      modulo_afectado: formData.get('modulo_afectado') as string || undefined,
      detalle_reclamacion: formData.get('detalle_reclamacion') as string,
      solucion_esperada: formData.get('solucion_esperada') as string,
      
      // Información adicional
      observaciones: formData.get('observaciones') as string || undefined,
    }

    // Validar campos requeridos
    const requiredFields = [
      'nombres', 'apellidos', 'tipo_documento', 'numero_documento',
      'email', 'telefono', 'direccion', 'tipo_reclamacion',
      'plan_suscripcion', 'fecha_incidente', 'detalle_reclamacion', 'solucion_esperada'
    ]
    
    for (const field of requiredFields) {
      if (!complaintData[field as keyof Complaint]) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `El campo ${field} es requerido` 
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // Inicializar cliente de Supabase con Service Role
    const supabase = getServiceSupabase()

    // Insertar la reclamación en la base de datos
    const { data: complaint, error: complaintError } = await supabase
      .from('complaints')
      .insert(complaintData)
      .select()
      .single()

    if (complaintError) {
      console.error('Error inserting complaint:', complaintError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Error al guardar la reclamación' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Procesar archivos adjuntos si existen
    const files = formData.getAll('files') as File[]
    const uploadedAttachments = []

    console.log('📁 Archivos recibidos:', files.length)

    for (const file of files) {
      if (file && file.size > 0) {
        console.log('📤 Procesando archivo:', file.name, file.type, file.size, 'bytes')
        
        // Validar tipo de archivo
        if (!isValidFileType(file.type)) {
          console.error('❌ Tipo de archivo no permitido:', file.type)
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Tipo de archivo no permitido: ${file.type}` 
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }

        // Validar tamaño de archivo
        if (!isValidFileSize(file.size)) {
          console.error('❌ Archivo muy grande:', file.name, file.size)
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `El archivo ${file.name} excede el tamaño máximo de 10MB` 
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }

        try {
          console.log('🔄 Subiendo archivo a Storage...')
          // Convertir el archivo a Buffer
          const arrayBuffer = await file.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          // Subir a Supabase Storage
          const { url, path } = await uploadFileToStorage(
            buffer,
            file.name,
            file.type,
            `complaints/${complaint.id}`
          )
          
          console.log('✅ Archivo subido:', path)
          console.log('🔗 URL:', url)

          // Guardar referencia en la base de datos
          const { data: attachment, error: attachmentError } = await supabase
            .from('complaint_attachments')
            .insert({
              complaint_id: complaint.id,
              file_name: file.name,
              file_type: file.type,
              file_size: file.size,
              file_url: url,
              s3_key: path, // Ahora es el path en Supabase Storage
            })
            .select()
            .single()

          if (attachmentError) {
            console.error('❌ Error guardando referencia del archivo:', attachmentError)
          } else {
            console.log('✅ Referencia guardada en DB')
            uploadedAttachments.push(attachment)
          }
        } catch (uploadError) {
          console.error('❌ Error al subir archivo:', uploadError)
          // Continuar con los demás archivos aunque uno falle
        }
      }
    }

    console.log('📊 Total archivos subidos:', uploadedAttachments.length)

    // Respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          complaint,
          attachments: uploadedAttachments,
          message: `Reclamación registrada exitosamente. Número de expediente: ${complaint.numero_expediente}`,
        },
      }),
      { 
        status: 201, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error interno del servidor' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

// Endpoint GET para consultar reclamaciones por email o número de expediente
export const GET: APIRoute = async ({ url }) => {
  try {
    const email = url.searchParams.get('email')
    const expediente = url.searchParams.get('expediente')

    if (!email && !expediente) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Debe proporcionar email o número de expediente' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const supabase = getServiceSupabase()

    let query = supabase
      .from('complaints')
      .select(`
        *,
        complaint_attachments (*)
      `)

    if (email) {
      query = query.eq('email', email)
    } else if (expediente) {
      query = query.eq('numero_expediente', expediente)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching complaints:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Error al consultar reclamaciones' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        data,
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Error interno del servidor' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
