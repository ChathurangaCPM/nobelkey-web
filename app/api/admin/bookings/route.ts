import connectDB from "@/lib/db";
import Booking from "@/modals/Bookings";
import { NextRequest, NextResponse } from "next/server";

// Remove force-dynamic if using client-side auth
// export const dynamic = 'force-dynamic';

interface FilterType {
    delete?: boolean;
    _id?: string;
}

export async function GET(req: NextRequest) {
    try {
        // Parse URL parameters
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const byId = searchParams.get('id');

        // Connect to database
        await connectDB();
        
        // Build filter
        const filter: FilterType = {};
        if (searchParams.get("delete")) filter.delete = false;
        if (byId) filter._id = byId;

        const getBookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            message: 'Booking get successfully',
            data: getBookings
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'An error occurred',
        }, { status: 500 });
    }
}