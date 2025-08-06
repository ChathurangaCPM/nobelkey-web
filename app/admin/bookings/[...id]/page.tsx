import { Suspense } from "react";
import { headers } from 'next/headers';
import SingleBooking from "@/app/components/admin/bookings/singleBooking";

function getBaseUrl() {
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return process.env.NEXTAUTH_URL || 'http://localhost:1234';
}

async function getSingleBooking(bookingId: string) {

    try {
        const baseUrl = getBaseUrl();
        const headersList = headers();
        const cookieHeader = headersList.get('cookie');
        
        const response = await fetch(`${baseUrl}/api/admin/bookings?id=${bookingId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieHeader || '',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();

        return data[0];
    } catch (error) {
        console.error('Error fetching singleBooking:', error);
        throw new Error('Failed to load singleBooking');
    }
}

export default async function PageDetails({ params }: { params: { id: string[] } }) {

    try {
        const singleBooking = await getSingleBooking(params?.id[0]);
        
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <SingleBooking data={singleBooking} />
                {/* <PageComponent initialData={singleBooking} /> */}
            </Suspense>
        );
    } catch (error) {
        console.log("error", error);
        
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">
                    Failed to load singleBooking. Please try again later.
                </div>
            </div>
        );
    }
}