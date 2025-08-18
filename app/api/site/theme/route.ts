import connectDB from "@/lib/db";
import Theme from "@/modals/Theme";
import {  NextResponse } from "next/server";

export async function GET() {
    try {
        // Connect to MongoDB
        await connectDB();
       
        // Fetch theme data with explicit conditions and error handling
        const themeData = await Theme.find().select('-emailSettings').lean().exec();

        // Check if theme data exists
        if (!themeData || themeData.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No theme data found'
            }, { status: 404 });
        }
        

        return NextResponse.json({
            success: true,
            data: themeData[0]
        }, { status: 200 });

    } catch (error) {
        console.error('API Error:', error);

        // Enhanced error handling
        let statusCode = 500;
        let errorMessage = 'Internal server error';

        if (error instanceof Error) {
            errorMessage = error.message;

            // More specific error handling
            if (errorMessage.includes('timeout')) {
                statusCode = 504;
            } else if (errorMessage.includes('connection')) {
                statusCode = 503;
            } else if (errorMessage.includes('validation')) {
                statusCode = 400;
            }
        }

        return NextResponse.json({
            success: false,
            message: errorMessage
        }, { status: statusCode });
    }
}

// For debugging: Add this helper route to check Theme model schema
export async function HEAD() {
    try {
        const connection = await connectDB();
        if (connection && connection.readyState === 1) {
            const modelInfo = Theme.schema.obj;
            console.log("Theme Model Schema:", modelInfo);
            return new NextResponse(null, { status: 200 });
        }
        return new NextResponse(null, { status: 503 });
    } catch (error) {
        console.error('Schema check error:', error);
        return new NextResponse(null, { status: 500 });
    }
}