import { Suspense } from "react";
import { headers } from 'next/headers';
import AddNewVehicle from "@/app/components/admin/vehicles/addNewVehicle";

function getBaseUrl() {
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return process.env.NEXTAUTH_URL || 'http://localhost:1234';
}

async function getVehicleData(pageId: string) {

    try {
        const baseUrl = getBaseUrl();
        const headersList = headers();
        const cookieHeader = headersList.get('cookie');
        

        const response = await fetch(`${baseUrl}/api/admin/vehicle?id=${pageId}`, {
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
        console.error('Error fetching vehicles:', error);
        throw new Error('Failed to load vehicles');
    }
}

export default async function VehicleDetails({ params }: { params: { id: string[] } }) {

    try {
        const vehicles = await getVehicleData(params?.id[0]);
        
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <AddNewVehicle data={vehicles}/>
            </Suspense>
        );
    } catch (error) {
        console.log("error", error);
        
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">
                    Failed to load vehicle. Please try again later.
                </div>
            </div>
        );
    }
}