module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
            },
            {
                protocol: 'https',
                hostname: 'dummyimage.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            
            {
                protocol: 'https',
                hostname: 'scontent.cdninstagram.com',
            },
           
            {
                protocol: 'https',
                hostname: 'googleapis.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: '*.s3.*.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'datingappimages-bucket.s3.eu-north-1.amazonaws.com',
            }
        ],
    },
    // Force dynamic rendering - prevent static generation
    experimental: {
        // dynamicIO is not a valid option in Next.js 14
    },
    // Disable static optimization for all pages
    output: 'standalone',
    // Add headers to prevent caching
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
                    },
                    {
                        key: 'Pragma',
                        value: 'no-cache',
                    },
                    {
                        key: 'Expires',
                        value: '0',
                    },
                    {
                        key: 'Surrogate-Control',
                        value: 'no-store',
                    },
                ],
            },
            {
                source: '/api/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
                    },
                    {
                        key: 'Pragma',
                        value: 'no-cache',
                    },
                    {
                        key: 'Expires',
                        value: '0',
                    },
                ],
            },
        ];
    },
    async redirects() {
        return [
            // Example redirects - replace these with your actual redirect needs
            // {
            //     source: '/shop/women/denim',
            //     destination: '/shop/category/women?category=denim',
            //     permanent: true, // This sets up a 301 redirect
            // },
            // Add more redirects as needed following this pattern
        ];
    },
};
