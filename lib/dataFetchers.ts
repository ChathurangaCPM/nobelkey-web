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
        
        // First, get the theme data to find the selected home page
        const Theme = (await import("@/modals/Theme")).default;
        const themeData = await Theme.find().lean().exec();
        
        if (themeData && themeData[0] && themeData[0]?.selectedHomePage) {
            // Fetch the selected home page
            const pageData = await Pages.findOne({
                _id: themeData[0]?.selectedHomePage
            }).lean().exec();
            return pageData;
        }
        
        // Fallback: try to find a page marked as home
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
        const timestamp = new Date().getTime();
        const res = await fetch(`${baseUrl}/api/site/page-data?slug=${slug}&t=${timestamp}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
            },
            cache: 'no-store'
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
