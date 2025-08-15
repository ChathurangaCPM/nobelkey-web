import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export interface S3UploadResult {
  key: string;
  url: string;
  bucket: string;
}

/**
 * Upload a file to S3
 * @param buffer - File buffer
 * @param key - S3 object key (file path)
 * @param contentType - MIME type of the file
 * @returns Promise<S3UploadResult>
 */
export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<S3UploadResult> {
  const bucketName = process.env.S3_BUCKET_NAME!;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    // Note: ACL removed - bucket should be configured for public read access
  });

  try {
    await s3Client.send(command);
    
    // Construct the public URL
    const url = `https://${bucketName}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
    
    return {
      key,
      url,
      bucket: bucketName,
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error(`Failed to upload file to S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete a file from S3
 * @param key - S3 object key (file path)
 * @returns Promise<void>
 */
export async function deleteFromS3(key: string): Promise<void> {
  const bucketName = process.env.S3_BUCKET_NAME!;

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error(`Failed to delete file from S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate a unique S3 key for a file
 * @param originalName - Original filename
 * @param userId - User ID for organization
 * @param fileType - Type of file (images, documents, etc.)
 * @returns string - S3 key
 */
export function generateS3Key(originalName: string, userId: string, fileType: 'images' | 'documents' = 'images'): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
  const fileExtension = originalName.split('.').pop()?.toLowerCase() || '';
  const fileName = `${uniqueSuffix}.${fileExtension}`;
  
  return `${fileType}/${year}/${month}/${day}/${userId}/${fileName}`;
}

/**
 * Get file type category based on MIME type
 * @param mimeType - MIME type of the file
 * @returns 'images' | 'documents'
 */
export function getFileTypeCategory(mimeType: string): 'images' | 'documents' {
  if (mimeType.startsWith('image/')) {
    return 'images';
  }
  return 'documents';
}

/**
 * Check if file type is supported
 * @param mimeType - MIME type of the file
 * @returns boolean
 */
export function isSupportedFileType(mimeType: string): boolean {
  const supportedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];
  
  const supportedDocumentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-zip-compressed'
  ];
  
  return supportedImageTypes.includes(mimeType) || supportedDocumentTypes.includes(mimeType);
}
