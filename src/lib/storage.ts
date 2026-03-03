import { getServiceSupabase } from './supabase'


const BUCKET_NAME = 'reclamaciones'


export async function uploadFileToStorage(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'complaints'
): Promise<{ url: string; path: string }> {
  const supabase = getServiceSupabase()
  
  
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(7)
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filePath = `${folder}/${timestamp}-${randomString}-${sanitizedFileName}`


  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      contentType,
      upsert: false,
    })

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  console.log('✅ Storage: Archivo subido exitosamente')
  console.log('   Data:', data)

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path)

  console.log('🔗 Storage: URL pública generada:', publicUrlData.publicUrl)

  return {
    url: publicUrlData.publicUrl,
    path: data.path,
  }
}

export async function deleteFileFromStorage(path: string): Promise<void> {
  const supabase = getServiceSupabase()

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path])

  if (error) {
    console.error('Error deleting file from Supabase Storage:', error)
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

export async function getSignedFileUrl(
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  const supabase = getServiceSupabase()

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(path, expiresIn)

  if (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`)
  }

  return data.signedUrl
}

export function isValidFileType(contentType: string): boolean {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'image/webp',
  ]
  return allowedTypes.includes(contentType)
}

export function isValidFileSize(size: number): boolean {
  const maxSize = 10 * 1024 * 1024 
  return size <= maxSize
}


export async function listFiles(folder: string = '') {
  const supabase = getServiceSupabase()

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(folder)

  if (error) {
    console.error('Error listing files:', error)
    throw new Error(`Failed to list files: ${error.message}`)
  }

  return data
}
