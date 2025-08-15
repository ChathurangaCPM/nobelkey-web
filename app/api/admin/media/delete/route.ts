import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/authOptions';
import MediaLibrary from '@/modals/MediaLibrary';
import { deleteFromS3 } from '@/lib/s3';

// Route segment configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: 'File ID is required' },
        { status: 400 }
      );
    }

    // Find the file in the database
    const mediaFile = await MediaLibrary.findOne({
      _id: fileId,
      userId: session.user.id
    });

    if (!mediaFile) {
      return NextResponse.json(
        { success: false, message: 'File not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete from S3 if s3Key exists
    if (mediaFile.s3Key) {
      try {
        await deleteFromS3(mediaFile.s3Key);
      } catch (s3Error) {
        console.error('Error deleting from S3:', s3Error);
        // Continue with database deletion even if S3 deletion fails
      }
    }

    // Delete from database
    await MediaLibrary.findByIdAndDelete(fileId);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error deleting file' 
      },
      { status: 500 }
    );
  }
}
