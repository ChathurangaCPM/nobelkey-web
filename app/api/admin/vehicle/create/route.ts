import { authOptions } from "@/lib/authOptions";
import Vehicle from "@/modals/Vehicles";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Get user session
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

        if (formData) {
            const createNew = await Vehicle.create({
                ...formData,
                userId: session?.user?.id
            });
            return NextResponse.json({
                success: true,
                data: createNew
            }, {
                status: 200
            })
        }



    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Error uploading files'
            },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    // Get user session
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

    if (formData) {
        const { id, ...rest } = formData;

        const update = await Vehicle.findByIdAndUpdate({
            _id: id
        }, rest);

        return NextResponse.json({
            success: true,
            data: update
        }, {
            status: 200
        })
    }


    return NextResponse.json(
        {
            success: false,
            message: 'Error update'
        },
        { status: 500 }
    );
}