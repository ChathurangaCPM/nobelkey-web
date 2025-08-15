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
    // reactStrictMode: true,
    // distDir: 'dist',
    // output: 'export'
    // reactStrictMode: true,
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
