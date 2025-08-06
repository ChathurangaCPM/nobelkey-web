import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/authOptions';
import MediaLibrary from '@/modals/MediaLibrary';

// Route segment configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Configuration for image optimization
const IMAGE_QUALITY = 80;
const MAX_WIDTH = 1920;
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

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
        const files = formData.getAll('images') as File[];
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
                if (file.size > MAX_FILE_SIZE) {
                    throw new Error(`File ${file.name} exceeds maximum size of 1MB`);
                }

                if (!file.type.startsWith('image/')) {
                    throw new Error(`File ${file.name} is not an image`);
                }

                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');

                const uploadDir = path.join(process.cwd(), 'public', 'uploads', String(year), month);
                await mkdir(uploadDir, { recursive: true });

                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
                const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
                const fileName = `${uniqueSuffix}.${fileExtension}`;
                const filePath = path.join(uploadDir, fileName);

                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const optimizedBuffer = await optimizeImage(buffer);

                await writeFile(filePath, optimizedBuffer);

                const publicPath = `/uploads/${year}/${month}/${fileName}`;
                
                // Create MediaLibrary entry
                const mediaEntry = await MediaLibrary.create({
                    userId: session?.user?.id, 
                    type: type || file.type,
                    title: title || file.name,
                    alt: alt || title || file.name,
                    description: description || '',
                    url: publicPath,
                    access: access,
                });

                const compressionRatio = (
                    (1 - optimizedBuffer.length / buffer.length) * 100
                ).toFixed(1);

                return {
                    _id: mediaEntry._id,
                    path: publicPath,
                    originalSize: buffer.length,
                    optimizedSize: optimizedBuffer.length,
                    compressionRatio: `${compressionRatio}%`,
                    title: mediaEntry.title,
                    type: mediaEntry.type,
                    alt: mediaEntry.alt,
                    description: mediaEntry.description
                };
            })
        );

        return NextResponse.json({
            success: true,
            message: 'Files uploaded and saved to database successfully',
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