import { authOptions } from "@/lib/authOptions";
import Theme from "@/modals/Theme";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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

        const updatedTheme = await Theme.findOne(
            { userId: session.user.id }
        ).lean();


        return NextResponse.json({
            success: true,
            data: {
                theme: updatedTheme
            },
        }, {
            status: 200
        })


    } catch (error) {
        return NextResponse.json(
            { success: false, message: error },
            { status: 401 }
        );
    }
}