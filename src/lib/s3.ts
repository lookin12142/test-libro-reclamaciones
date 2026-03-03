import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Configuración del cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'libro-reclamaciones-archivos'

/**
 * Sube un archivo a S3
 * @param file - Archivo a subir
 * @param folder - Carpeta dentro del bucket (ej: 'complaints')
 * @returns Objeto con la URL y key del archivo
 */
export async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'complaints'
): Promise<{ url: string; key: string }> {
  // Generar un nombre único para el archivo
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(7)
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const key = `${folder}/${timestamp}-${randomString}-${sanitizedFileName}`

  // Comando para subir el archivo
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    // ACL: 'public-read', // Descomenta si quieres que los archivos sean públicos
  })

  try {
    await s3Client.send(command)
    
    // Generar URL del archivo
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    
    return { url, key }
  } catch (error) {
    console.error('Error uploading file to S3:', error)
    throw new Error('Failed to upload file to S3')
  }
}

/**
 * Elimina un archivo de S3
 * @param key - Key del archivo en S3
 */
export async function deleteFileFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  try {
    await s3Client.send(command)
  } catch (error) {
    console.error('Error deleting file from S3:', error)
    throw new Error('Failed to delete file from S3')
  }
}

/**
 * Genera una URL firmada temporal para acceder a un archivo privado
 * @param key - Key del archivo en S3
 * @param expiresIn - Tiempo de expiración en segundos (default: 3600 = 1 hora)
 * @returns URL firmada temporal
 */
export async function getSignedFileUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return url
  } catch (error) {
    console.error('Error generating signed URL:', error)
    throw new Error('Failed to generate signed URL')
  }
}

/**
 * Valida el tipo de archivo permitido
 */
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

/**
 * Valida el tamaño del archivo (máximo 10MB)
 */
export function isValidFileSize(size: number): boolean {
  const maxSize = 10 * 1024 * 1024 // 10MB en bytes
  return size <= maxSize
}
