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

async function optimizeImage(imageData: any): Promise<Uint8Array> {
  const image = sharp(imageData);
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
  
  const optimizedBuffer = await pipeline.toBuffer();
  return new Uint8Array(optimizedBuffer);
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
    const files = formData.getAll('files') as File[];
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

        // Convert file to Uint8Array directly with type assertion
        const arrayBuffer = await file.arrayBuffer();
        const originalData = new Uint8Array(arrayBuffer as ArrayBuffer);
        let processedData = originalData;
        let compressionRatio = '0%';

        // Only optimize images
        if (fileCategory === 'images') {
          try {
            processedData = await optimizeImage(originalData);
            compressionRatio = (
              (1 - processedData.length / originalData.length) * 100
            ).toFixed(1) + '%';
          } catch (error) {
            console.warn(`Failed to optimize image ${file.name}:`, error);
            // Use original data if optimization fails
            processedData = originalData;
          }
        }

        // Convert to Buffer for S3 upload
        const uploadBuffer = Buffer.from(processedData);

        // Generate S3 key
        const s3Key = generateS3Key(file.name, session.user.id!, fileCategory);

        // Upload to S3
        const s3Result = await uploadToS3(uploadBuffer, s3Key, file.type);

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
          fileSize: processedData.length,
          originalSize: originalData.length,
          optimizedSize: fileCategory === 'images' ? processedData.length : undefined,
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
          originalSize: originalData.length,
          optimizedSize: processedData.length,
          compressionRatio: compressionRatio,
          title: mediaEntry.title,
          type: mediaEntry.type,
          alt: mediaEntry.alt,
          description: mediaEntry.description,
          fileCategory: fileCategory,
          mimeType: file.type,
          fileSize: processedData.length
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
