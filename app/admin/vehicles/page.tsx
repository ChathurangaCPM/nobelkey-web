export const dynamic = 'force-dynamic';
import AllVehicles from "@/app/components/admin/vehicles/allVehicles";
import { headers } from "next/headers";
import { Suspense } from "react";

function getBaseUrl() {
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return process.env.NEXTAUTH_URL || 'http://localhost:1234';
}


async function getAllVehicles() {
    try {
        const baseUrl = getBaseUrl();

        const headersList = headers();
        const cookieHeader = headersList.get('cookie');

        const response = await fetch(`${baseUrl}/api/admin/vehicle`, {
            method: 'GET',
            headers: {
                Cookie: cookieHeader || '', // Forward the cookies
            },
            credentials: 'include', // Important for session handling
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();


        return data;
    } catch (error) {
        console.error('Error fetching pages:', error);
        throw new Error('Failed to load pages');
    }
}


export default async function VehiclePage() {
    try {
        const pages = await getAllVehicles();
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <AllVehicles initialData={pages} />
            </Suspense>
        );
    } catch (error) {
        console.log("error", error);
        
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">
                    Failed to load pages. Please try again later.
                </div>
            </div>
        );
    }
}