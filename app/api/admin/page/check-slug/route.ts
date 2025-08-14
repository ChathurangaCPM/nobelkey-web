import { authOptions } from "@/lib/authOptions";
import Pages from "@/modals/Pages";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

        const url = new URL(req.url);
        const slug = url.searchParams.get('slug');
        const excludeId = url.searchParams.get('excludeId'); // For edit mode

        if (!slug) {
            return NextResponse.json(
                { success: false, message: 'Slug parameter is required' },
                { status: 400 }
            );
        }

        // Build query to check if slug exists
        const query: any = { 
            slug: slug,
            delete: { $ne: true } // Exclude deleted pages
        };

        // Exclude current page when editing
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const existingPage = await Pages.findOne(query);

        return NextResponse.json({
            success: true,
            exists: !!existingPage
        }, {
            status: 200
        });

    } catch (error) {
        console.error('Slug check error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Error checking slug'
            },
            { status: 500 }
        );
    }
}
