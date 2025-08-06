import connectDB from "@/lib/db";
import Vehicle from "@/modals/Vehicles";
import {  NextResponse } from "next/server";

export async function GET() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MongoDB URI is not defined in environment variables");
        }


        await connectDB();


        const vehicleData = await Vehicle.find({ isActive: true }).lean().exec();

        return NextResponse.json({
            success: true,
            data: vehicleData
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error
        }, { status: 500 });
    }

}