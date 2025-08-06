import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/emailService";
import Booking from "@/modals/Bookings";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


// Authentication middleware
const authenticateUser = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error('Unauthorized');
    }
    return session.user;
};



export async function PUT(req: NextRequest) {
    try {
        await authenticateUser();

        await connectDB()

        const formData = await req.json();

       

        const res = await Booking.findByIdAndUpdate(
            {
                _id: formData?.bookingId
            },
            {
                currentStatus: formData?.status
            },
            { new: true } 
        )

        if (res && res?.bookingData?.email) {
            await sendEmail({
                to: res?.bookingData?.email ,
                subject: 'Booking Status Changed! - www.citycabfrance.com',
                html: `Your booking(${res?.bookingId || ''}) status was change to ${formData?.status}`
            });
        }

        return NextResponse.json({
            success: true,
            data: res || {}
        }, {
            status: 200
        })

    } catch (error) {
        console.log("error", error);
        
        return NextResponse.json({
            success: false,
            message: 'Failed to update'
        }, {
            status: 400
        })
    }
}