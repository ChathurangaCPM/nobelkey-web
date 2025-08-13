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


        // Fetch page data with explicit conditions and error handling
        const pageData = await Pages.find({
            slug
        }).lean().exec();

        return NextResponse.json({
            success: true,
            data: pageData[0]
        }, { status: 200 });

    } catch (error) {

        return NextResponse.json({
            success: false,
            data: error
        }, { status: 400 });
    }
}