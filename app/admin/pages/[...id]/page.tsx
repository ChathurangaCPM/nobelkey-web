import { Suspense } from "react";
import { headers } from 'next/headers';
import CreateNewPage from "@/app/components/admin/pages/createNewPage";


async function getPageData(pageId: string) {

    try {
        const headersList = headers();
        const cookieHeader = headersList.get('cookie');
        

        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/page?id=${pageId}`, {
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
        console.error('Error fetching pages:', error);
        throw new Error('Failed to load pages');
    }
}

export default async function PageDetails({ params }: { params: { id: string[] } }) {

    try {
        const pages = await getPageData(params?.id[0]);
        
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <CreateNewPage data={pages} />
                {/* <PageComponent initialData={pages} /> */}
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