import { authOptions } from "@/lib/authOptions";
import Pages from "@/modals/Pages";
import { ContactForm } from "@/modals/ContactForm";
import MediaLibrary from "@/modals/MediaLibrary";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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

        // Connect to database
        await connectDB();

        // Get current date for recent statistics
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Parallel database queries for better performance
        const [
            totalPages,
            recentPages,
            totalContacts,
            recentContacts,
            totalMedia,
            recentMedia
        ] = await Promise.all([
            // Pages statistics
            Pages.countDocuments({ userId: user.id, delete: { $ne: true } }),
            Pages.countDocuments({ 
                userId: user.id, 
                delete: { $ne: true },
                createdAt: { $gte: lastWeek }
            }),
            
            // Contact form statistics
            ContactForm.countDocuments({}),
            ContactForm.countDocuments({ 
                createdAt: { $gte: lastWeek }
            }),
            
            // Media library statistics
            MediaLibrary.countDocuments({ userId: user.id }),
            MediaLibrary.countDocuments({ 
                userId: user.id,
                createdAt: { $gte: lastWeek }
            })
        ]);

        // Calculate growth percentages (simplified calculation)
        const pagesGrowth = totalPages > 0 ? Math.round((recentPages / totalPages) * 100) : 0;
        const contactsGrowth = totalContacts > 0 ? Math.round((recentContacts / totalContacts) * 100) : 0;
        const mediaGrowth = totalMedia > 0 ? Math.round((recentMedia / totalMedia) * 100) : 0;

        const dashboardData = {
            pages: {
                total: totalPages,
                recent: recentPages,
                growth: pagesGrowth
            },
            contacts: {
                total: totalContacts,
                recent: recentContacts,
                growth: contactsGrowth
            },
            media: {
                total: totalMedia,
                recent: recentMedia,
                growth: mediaGrowth
            }
        };

        return NextResponse.json({
            success: true,
            data: dashboardData
        }, { status: 200 });

    } catch (error) {
        console.error('Dashboard API error:', error);
        
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
