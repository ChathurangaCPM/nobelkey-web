import connectDB from "@/lib/db";
import Pages from "@/modals/Pages";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Parse URL parameters
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const slug = searchParams.get('slug');

        console.log("slug==", slug);
        
        // Fetch page data with explicit conditions and error handling
        const pageData = await Pages.find({
            slug
        }).lean().exec();

        const response = NextResponse.json({
            success: true,
            data: pageData[0]
        }, { status: 200 });

        // Set cache control headers to prevent caching
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        response.headers.set('Surrogate-Control', 'no-store');

        return response;

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
