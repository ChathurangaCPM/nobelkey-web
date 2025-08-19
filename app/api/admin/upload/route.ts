import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/authOptions';
import MediaLibrary from '@/modals/MediaLibrary';
import { 
  uploadToS3, 
  generateS3Key, 
  getFileTypeCategory, 
  isSupportedFileType 
} from '@/lib/s3';

// Route segment configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Configuration for image optimization
const IMAGE_QUALITY = 80;
const MAX_WIDTH = 1920;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for documents, 5MB for images
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB for images

async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  const format = (metadata.format === 'jpeg' || metadata.format === 'jpg') ? 'jpeg' : 'png';
  
  let pipeline = image
    .rotate()
    .resize({
      width: MAX_WIDTH,
      height: undefined,
      withoutEnlargement: true,
      fit: 'inside',
    });
  
  if (format === 'jpeg') {
    pipeline = pipeline.jpeg({
      quality: IMAGE_QUALITY,
      mozjpeg: true,
    });
  } else {
    pipeline = pipeline.png({
      quality: IMAGE_QUALITY,
      compressionLevel: 9,
      palette: true,
    });
  }
  
  return pipeline.toBuffer();
}

export async function POST(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[]; // Changed from 'images' to 'files'
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const alt = formData.get('alt') as string;
    const type = formData.get('type') as string;
    const access = formData.get('access') ? JSON.parse(formData.get('access') as string) : [];

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        // Check if file type is supported
        if (!isSupportedFileType(file.type)) {
          throw new Error(`File type ${file.type} is not supported for file ${file.name}`);
        }

        const fileCategory = getFileTypeCategory(file.type);
        const maxSize = fileCategory === 'images' ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;

        if (file.size > maxSize) {
          const maxSizeMB = maxSize / (1024 * 1024);
          throw new Error(`File ${file.name} exceeds maximum size of ${maxSizeMB}MB for ${fileCategory}`);
        }

        const bytes = await file.arrayBuffer();
        const originalBuffer = Buffer.from(bytes);
        let processedBuffer = originalBuffer;
        let compressionRatio = '0%';

        // Only optimize images
        if (fileCategory === 'images') {
          try {
            // Pass the buffer directly to optimizeImage
            processedBuffer = await optimizeImage(originalBuffer);
            compressionRatio = (
              (1 - processedBuffer.length / originalBuffer.length) * 100
            ).toFixed(1) + '%';
          } catch (error) {
            console.warn(`Failed to optimize image ${file.name}:`, error);
            // Use original buffer if optimization fails
            processedBuffer = originalBuffer;
          }
        }

        // Generate S3 key
        const s3Key = generateS3Key(file.name, session.user.id!, fileCategory);

        // Upload to S3
        const s3Result = await uploadToS3(processedBuffer, s3Key, file.type);

        // Create MediaLibrary entry
        const mediaEntry = await MediaLibrary.create({
          userId: session.user.id,
          type: type || file.type,
          title: title || file.name,
          alt: alt || title || file.name,
          description: description || '',
          url: s3Result.url,
          s3Key: s3Result.key,
          s3Bucket: s3Result.bucket,
          fileSize: processedBuffer.length,
          originalSize: originalBuffer.length,
          optimizedSize: fileCategory === 'images' ? processedBuffer.length : undefined,
          compressionRatio: fileCategory === 'images' ? compressionRatio : undefined,
          fileCategory: fileCategory,
          mimeType: file.type,
          access: access,
        });

        return {
          _id: mediaEntry._id,
          path: s3Result.url, // For backward compatibility
          url: s3Result.url,
          s3Key: s3Result.key,
          s3Bucket: s3Result.bucket,
          originalSize: originalBuffer.length,
          optimizedSize: processedBuffer.length,
          compressionRatio: compressionRatio,
          title: mediaEntry.title,
          type: mediaEntry.type,
          alt: mediaEntry.alt,
          description: mediaEntry.description,
          fileCategory: fileCategory,
          mimeType: file.type,
          fileSize: processedBuffer.length
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Files uploaded successfully to S3 and saved to database',
      files: uploadResults
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error uploading files' 
      },
      { status: 500 }
    );
  }
}
