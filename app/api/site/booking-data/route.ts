import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";

// Define interfaces for better type safety
interface VehicleData {
    initialCharge?: number;
    maxPassenger?: number;
    perKmPrice?: number;
    vehicleName?: string;
    _id?: string;
}

interface LocationData {
    locations: Array<{
        id: string;
        name: string;
        latitude: string;
        longitude: string;
    }>;
    _id: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data?: {
        vehicles: VehicleData[];
        locations: LocationData[];
    };
    error?: string;
}


export async function GET() {
    try {
        // Connect to MongoDB
        await connectDB();

        // Run queries in parallel using Promise.all
        return NextResponse.json({
            success: true,
            message: 'Internal server error',
        } as ApiResponse, { status: 500 });


    } catch (error) {
        console.error('API Error:', error);
        
        return NextResponse.json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        } as ApiResponse, { status: 500 });
    } finally {
        // If you're using serverless functions and want to optimize connection handling
        if (process.env.NODE_ENV === 'development') {
            await mongoose.disconnect();
        }
    }
}