import { authOptions } from "@/lib/authOptions";
import Theme from "@/modals/Theme";
import Vehicle from "@/modals/Vehicles";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Authentication middleware
const authenticateUser = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error('Unauthorized');
    }
    return session.user;
};

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }
    } catch (error) {
        console.error('MongoDB connection error:', error);
        return NextResponse.json({
            success: false,
            message: "Failed to connect to database"
        }, { status: 500 }); // Changed from 401 to 500 for database errors
    }
};

export async function GET() {
    try {
        // Authentication
        const user = await authenticateUser();

        // Connect to database
        const dbResponse = await connectDB();
        if (dbResponse) return dbResponse; // Return early if DB connection failed

        try {
            const [vehicles, locations] = await Promise.all([
                Vehicle.find({ isActive: true }).lean(),
                Theme.find({ userId: user?.id }).select('locations').lean(),
            ]);

            return NextResponse.json({
                success: true,
                data: {
                    vehicles: vehicles,
                    locations: locations[0]?.locations || []
                }
            }, { status: 200 });
        } catch (error) {
            console.log("Database query error:", error);
            
            return NextResponse.json({
                success: false,
                message: "Failed to fetch data"
            }, { status: 500 });
        }

    } catch (error) {
        console.log("Authentication error:", error);
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }
}