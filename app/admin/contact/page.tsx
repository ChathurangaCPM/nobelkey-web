// app/admin/pages/page.tsx
export const dynamic = 'force-dynamic';
import PageComponent from "@/app/components/admin/pages/pageComponent";
import { Suspense } from "react";
import { headers } from 'next/headers';
import ContactComponent from "@/app/components/admin/pages/contactComponent";

async function getAllPages() {
    try {
        
        const headersList = headers();
        const cookieHeader = headersList.get('cookie');
        
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/site/contact`, {
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
export default async function Page() {
    try {
        const pages = await getAllPages();        
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <ContactComponent initialData={pages} />
            </Suspense>
        );
    } catch (error) {
        console.log("error", error);
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">
                    Failed to load contacts. Please try again later.
                </div>
            </div>
        );
    }
}