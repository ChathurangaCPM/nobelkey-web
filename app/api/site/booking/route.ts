import { BookingProps } from "@/app/types/booking";
import { EMAIL_CONFIG } from "@/lib/config";
import connectDB from "@/lib/db";
import { sendEmail } from "@/lib/emailService";
import { generateBookingEmailTemplate } from "@/lib/emailTemplates";
import Booking from "@/modals/Bookings";
import BookingStatus from "@/modals/BookingStatus";
import { NextRequest, NextResponse } from "next/server";


async function createBooking(formData: BookingProps) {
    try {
        const booking = await Booking.create(formData);
        return booking;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw new Error('Failed to create booking');
    }
}

async function createBookingStatus(bookingId: string) {
    try {
        return await BookingStatus.create({ bookingId, status: "pending" });
    } catch (error) {
        console.error('Error creating booking status:', error);
        throw new Error('Failed to create booking status');
    }
}

async function sendBookingNotification(booking: BookingProps) {
    try {
        return await sendEmail({
            to: EMAIL_CONFIG.ADMIN_EMAIL,
            subject: EMAIL_CONFIG.SUBJECTS.NEW_BOOKING,
            html: generateBookingEmailTemplate(booking)
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email notification');
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        await connectDB();
        const formData = await request.json() as BookingProps;

        // Validate required fields
        if (!formData?.bookingData?.email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        // Create booking
        const booking = await createBooking(formData);

        if (!booking?._id) {
            throw new Error('Booking creation failed');
        }

        // Parallel processing of email and status creation
        await Promise.all([
            sendBookingNotification(formData),
            createBookingStatus(booking._id)
        ]);

        return NextResponse.json(
            {
                message: 'Booking created successfully',
                data: booking
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Booking process failed:', error);
        return NextResponse.json(
            {
                message: 'Booking process failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}