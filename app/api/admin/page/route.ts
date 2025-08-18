import { authOptions } from "@/lib/authOptions";
import Pages from "@/modals/Pages";
import Theme from "@/modals/Theme";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


// Force dynamic rendering
export const dynamic = 'force-dynamic';


// Types
interface FilterType {
    delete?: boolean;
    _id?: string;
}


// Database connection utility
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw new Error('Failed to connect to database');
    }
};

// Authentication middleware
const authenticateUser = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error('Unauthorized');
    }
    return session.user;
};

export async function GET(req: NextRequest) {
    try {
        // Authentication
        const user = await authenticateUser();

        // Parse URL parameters
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const byId = searchParams.get('id');

        // Build filter
        const filter: FilterType = {};
        if (searchParams.get("delete")) filter.delete = false;
        if (byId) filter._id = byId;

        // Connect to database
        await connectDB();

        // Parallel database queries for better performance
        const [pages, theme] = await Promise.all([
            Pages.find(filter).populate('parent', 'title slug').lean(),
            Theme.findOne({ userId: user.id }).select('selectedHomePage').lean()
        ]);

        // Process pages data
        const processedPages = pages?.map((page) => ({
            ...page,
            _id: page._id.toString(),
            isHomePage: page._id.toString() === theme?.selectedHomePage?.toString()
        })) || [];

        return NextResponse.json({
            success: true,
            data: processedPages
        }, { status: 200 });

    } catch (error) {
        console.error('API error:', error);
        
        // Handle specific error types
        if (error instanceof Error) {
            if (error.message === 'Unauthorized') {
                return NextResponse.json(
                    { success: false, message: 'Unauthorized' },
                    { status: 401 }
                );
            }
            
            if (error.message === 'Failed to connect to database') {
                return NextResponse.json(
                    { success: false, message: 'Database connection failed' },
                    { status: 503 }
                );
            }
        }

        // Generic error response
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        // Authentication
        const user = await authenticateUser();

        // Parse URL parameters
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const pageId = searchParams.get('id');

        if (!pageId) {
            return NextResponse.json(
                { success: false, message: 'Page ID is required' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Check if page exists and belongs to user
        const page = await Pages.findOne({ 
            _id: pageId, 
            userId: user.id,
            delete: { $ne: true }
        }).lean();

        if (!page) {
            return NextResponse.json(
                { success: false, message: 'Page not found' },
                { status: 404 }
            );
        }

        // Check if this is the home page
        const theme = await Theme.findOne({ userId: user.id }).select('selectedHomePage').lean();
        if (page._id.toString() === theme?.selectedHomePage?.toString()) {
            return NextResponse.json(
                { success: false, message: 'Cannot delete the home page' },
                { status: 400 }
            );
        }

        // Check if page has children
        const childPages = await Pages.find({ 
            parent: pageId, 
            delete: { $ne: true } 
        }).lean();

        if (childPages.length > 0) {
            return NextResponse.json(
                { success: false, message: 'Cannot delete page with child pages. Please delete or move child pages first.' },
                { status: 400 }
            );
        }

        // Soft delete the page
        await Pages.findByIdAndUpdate(pageId, { 
            delete: true,
            updatedAt: new Date()
        });

        return NextResponse.json({
            success: true,
            message: 'Page deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Delete API error:', error);
        
        // Handle specific error types
        if (error instanceof Error) {
            if (error.message === 'Unauthorized') {
                return NextResponse.json(
                    { success: false, message: 'Unauthorized' },
                    { status: 401 }
                );
            }
            
            if (error.message === 'Failed to connect to database') {
                return NextResponse.json(
                    { success: false, message: 'Database connection failed' },
                    { status: 503 }
                );
            }
        }

        // Generic error response
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
