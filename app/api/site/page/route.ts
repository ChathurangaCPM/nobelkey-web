import connectDB from "@/lib/db";
import Pages from "@/modals/Pages";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Connect to MongoDB
        await connectDB();


        // Fetch page data with explicit conditions and error handling
        const pageData = await Pages.find({
            isHome: true
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