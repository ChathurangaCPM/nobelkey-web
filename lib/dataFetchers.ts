import connectDB from "@/lib/db";
import Pages from "@/modals/Pages";

// Helper function to determine if we're in build time
function isBuildTime() {
    // During build time, we don't have a running server, so we should use direct DB access
    return typeof window === 'undefined' && (
        process.env.NODE_ENV === 'production' || 
        !process.env.NEXT_PUBLIC_API_URL ||
        process.env.NEXT_PHASE === 'phase-production-build'
    );
}

// Helper function to get the base URL for API calls
function getApiBaseUrl() {
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:1234';
    }
    return process.env.NEXTAUTH_URL || 'https://noblekey.lk';
}

// Fetch home page data - works both at build time and runtime
export async function getHomePageData() {
    try {
        // Always use direct database access for now to avoid issues
        await connectDB();
        const pageData = await Pages.findOne({ isHome: true }).lean().exec();
        return pageData;
    } catch (error) {
        console.error('Error fetching home data:', error);
        return null;
    }
}

// Fetch page data by slug - works both at build time and runtime
export async function getPageDataBySlug(slug: string) {
    try {
        // During build time, access database directly
        if (isBuildTime() || process.env.NODE_ENV === 'development') {
            await connectDB();
            const pageData = await Pages.findOne({ slug }).lean().exec();
            return pageData;
        }

        // During runtime, use API
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/site/page-data?slug=${slug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 3600
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch page data');
        }

        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching page data:', error);
        return null;
    }
}
