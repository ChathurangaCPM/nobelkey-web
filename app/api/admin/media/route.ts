import { authOptions } from "@/lib/authOptions";
import MediaLibrary from "@/modals/MediaLibrary";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
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

        const getMedia = await MediaLibrary.find({
            userId: session?.user?.id
        }).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            message: 'Files uploaded and saved to database successfully',
            files: getMedia
        });

    } catch (error) {
        console.log("error", error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}