import connectDB from "@/lib/db";
import Pages from "@/modals/Pages";
import Theme from "@/modals/Theme";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Connect to MongoDB
        await connectDB();

        // Fetch theme data with explicit conditions and error handling
        const themeData = await Theme.find().lean().exec();

        if (themeData && themeData[0] && themeData[0]?.selectedHomePage) {
            // Fetch page data with explicit conditions and error handling
            const pageData = await Pages.find({
                _id: themeData[0]?.selectedHomePage
            }).lean().exec();
            

            const response = NextResponse.json({
                success: true,
                data: {
                    themeData: themeData[0],
                    pageData: pageData[0],
                }
            }, { status: 200 });

            // Set cache control headers to prevent caching
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            response.headers.set('Pragma', 'no-cache');
            response.headers.set('Expires', '0');
            response.headers.set('Surrogate-Control', 'no-store');

            return response;
        }

        const errorResponse = NextResponse.json({
            success: false,
            data: 'Page not found'
        }, { status: 400 });

        // Set cache control headers for error responses too
        errorResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        errorResponse.headers.set('Pragma', 'no-cache');
        errorResponse.headers.set('Expires', '0');

        return errorResponse;

    } catch (error) {
        const errorResponse = NextResponse.json({
            success: false,
            data: error
        }, { status: 400 });

        // Set cache control headers for error responses
        errorResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        errorResponse.headers.set('Pragma', 'no-cache');
        errorResponse.headers.set('Expires', '0');

        return errorResponse;
    }
}
