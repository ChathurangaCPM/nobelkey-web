import { authOptions } from "@/lib/authOptions";
import Theme from "@/modals/Theme";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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

        const formData = await req.json();

        if (!formData) {
            return NextResponse.json(
                { success: false, message: 'No data found' },
                { status: 400 }
            );
        }

        const { type, data } = formData;
        

        // Use findOneAndUpdate with upsert option
        const updatedTheme = await Theme.findOneAndUpdate(
            { userId: session.user.id },
            {
                $set: {
                    userId: session.user.id, // Ensure userId is set for new documents
                    [type]: data
                }
            },
            {
                new: true, // Return the modified document rather than the original
                upsert: true, // Create a new document if one doesn't exist
                runValidators: true // Run validators for update
            }
        );

        return NextResponse.json(
            {
                success: true,
                message: 'Successfully updated',
                data: updatedTheme
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error in theme update:', error);
        return NextResponse.json(
            { 
                success: false, 
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}