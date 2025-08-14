// Type definitions

import BlogSection from "@/app/components/home/blogSection";
import FeaturedServices from "@/app/components/home/featuredServices";
import GetQuote from "@/app/components/home/getQuote";
import NumberResults from "@/app/components/home/numberResults";
import OurBrandRow from "@/app/components/home/ourBrandRow";
import RecentProjects from "@/app/components/home/recentProjects";
import WelcomeSection from "@/app/components/home/welcomeSection";
import ChooseNoblekey from "@/app/components/innerPages/chooseNoblekey";
import FaqSection from "@/app/components/innerPages/faqSection";
import GeneralContent from "@/app/components/innerPages/generalContent";
import InnerBanner from "@/app/components/innerPages/innerBanner";
import SolutionsCardSection from "@/app/components/innerPages/solutionsCardSection";
import MainBanner from "@/app/components/mainBanner";

// Generic type for component props
type GenericProps = {
    [key: string]: unknown;  // More type-safe than 'any'
};

interface PageComponent {
    id: string;
    type: string;
    customName: keyof typeof componentMap;  // Ensures customName matches componentMap keys
    props: GenericProps;
}

// Component mapping object
const componentMap = {
    mainBanner: MainBanner,
    welcomeSection: WelcomeSection,
    numberResults: NumberResults,
    featuredServices: FeaturedServices,
    recentProjects: RecentProjects,
    ourBrandRow: OurBrandRow,
    getQuote: GetQuote,
    blogSection: BlogSection,

    // inner pages related components
    innerBanner: InnerBanner,
    generalContent: GeneralContent,
    chooseNobelkey: ChooseNoblekey,
    faqSection: FaqSection,
    solutionsCards: SolutionsCardSection,

} as const;





// Helper function to get the base URL
function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }
    if (process.env.SITE_ENV === 'development') {
        return 'http://localhost:1222';
    }
    return process.env.NEXTAUTH_URL || 'https://noblekey.lk';
}

async function getPagesViewPageData(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/site/page-data?slug=${slug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(process.env.NEXTAUTH_URL && { 'origin': process.env.NEXTAUTH_URL })
            },
            next: {
                revalidate: 3600
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch home data');
        }

        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching home data:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: { slug: string[] } }) {
    const baseUrl = getBaseUrl();
    const getPageSlug = params?.slug[params?.slug.length - 1] 
    const ogImageUrl = `${baseUrl}/images/og-image.png`;
    const getPageData = await getPagesViewPageData(getPageSlug);

    return {
        title: getPageData?.seoData?.basicSeo?.title || '',
        description: getPageData?.seoData?.basicSeo?.description || '',
        keywords: getPageData?.seoData?.basicSeo?.keywords || '',
        metadataBase: new URL(baseUrl),
        openGraph: {
            title: getPageData?.seoData?.basicSeo?.title || '',
            description: (getPageData?.seoData?.ogSeo?.description || getPageData?.seoData?.basicSeo?.description) || '',
            images: [
                {
                    url: ogImageUrl,
                    alt: getPageData?.seoData?.basicSeo?.title || '',
                    width: 1200,
                    height: 630,
                },
            ],
            siteName: 'City Cabs France',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: getPageData?.seoData?.basicSeo?.title || '',
            description: (getPageData?.seoData?.ogSeo?.description || getPageData?.seoData?.basicSeo?.description) || '',
            images: [ogImageUrl],
        },
    };
}

const PagesView = async ({ params }: { params: { slug: string[] } }) => {

    const getPageSlug = params?.slug[params?.slug.length - 1].trim() 

    const getPageData = await getPagesViewPageData(getPageSlug);
    const pageData = getPageData;

    console.log("getPageSlug===", pageData);
    


    const renderComponent = (component: PageComponent) => {
        const Component = componentMap[component.customName];

        if (!Component) {
            console.warn(`Component ${component.customName} not found in componentMap`);
            return null;
        }

        return <Component serviceItems={[]} key={component.id} {...component.props} />;
    };

    if (!pageData?.components || pageData.components.length === 0) {
        return <div>No components to display</div>;
    }


    return (
        <div>
            {pageData.components.map((component: PageComponent) => renderComponent(component))}
        </div>
    );
};

export default PagesView;