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
            

            return NextResponse.json({
                success: true,
                data: {
                    themeData: themeData[0],
                    pageData: pageData[0],
                }
            }, { status: 200 });

        }

        return NextResponse.json({
            success: false,
            data: 'Page not found'
        }, { status: 400 });



    } catch (error) {

        return NextResponse.json({
            success: false,
            data: error
        }, { status: 400 });
    }
}