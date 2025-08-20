import { Metadata, Viewport } from 'next';
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
import RichContent from "@/app/components/innerPages/richContent";
import GetAQuoteRow from "@/app/components/innerPages/getAQuoteRow";
import ImageInformationCards from "@/app/components/innerPages/imageInformationCards";
import InnerBanner from "@/app/components/innerPages/innerBanner";
import OtherServices from "@/app/components/innerPages/otherServices";
import ProductDescription from "@/app/components/innerPages/productDescription";
import ProductTable from "@/app/components/innerPages/productTable";
import ProjectListing from "@/app/components/innerPages/projectsListing";
import SingleSliderCardSection from "@/app/components/innerPages/singleSliderCard";
import SolutionsCardSection from "@/app/components/innerPages/solutionsCardSection";
import MainBanner from "@/app/components/mainBanner";
import ProjectOverview from "@/app/components/innerPages/projectOverview";
import ProjectSlider from "@/app/components/innerPages/projectSlider";
import ContactCard from "@/app/components/innerPages/contactCard";
import ContactForm from "@/app/components/innerPages/contactForm";
import { getPageDataBySlug } from "@/lib/dataFetchers";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Type definitions
type GenericProps = {
    [key: string]: unknown;
};

interface PageComponent {
    id: string;
    type: string;
    customName: keyof typeof componentMap;
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
    richContent: RichContent,
    chooseNobelkey: ChooseNoblekey,
    faqSection: FaqSection,
    solutionsCards: SolutionsCardSection,
    singleSlider: SingleSliderCardSection,
    productTable: ProductTable,
    getAQuoteRow: GetAQuoteRow,
    imageInformationCards: ImageInformationCards,
    productDescription: ProductDescription,
    otherSolutions: OtherServices,
    projects: ProjectListing,
    projectOverview: ProjectOverview,
    projectSlider: ProjectSlider,
    contactCard: ContactCard,
    contactForm: ContactForm

} as const;

// Generate viewport for SEO
export async function generateViewport({ params }: { params: { slug: string[] } }): Promise<Viewport> {
    try {
        const pageSlug = params?.slug[params?.slug.length - 1]?.trim();
        const pageData = await getPageDataBySlug(pageSlug) as any;
        const basicSeo = pageData?.seoData?.basicSeo;
        
        return {
            width: 'device-width',
            initialScale: 1.0,
            ...(basicSeo?.viewport && { themeColor: '#000000' }),
        };
    } catch (error) {
        console.error('Error generating viewport:', error);
    }

    return {
        width: 'device-width',
        initialScale: 1.0,
    };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
    try {
        const pageSlug = params?.slug[params?.slug.length - 1]?.trim();
        const pageData = await getPageDataBySlug(pageSlug) as any;

        console.log("pageData===", pageData);
        
        if (pageData) {
            // Prioritize seoData structure over legacy meta fields
            const basicSeo = pageData.seoData?.basicSeo;
            const ogSeo = pageData.seoData?.ogSeo;
            
            // Get title with priority: seoData.basicSeo.title > metaTitle > title > fallback
            const title = basicSeo?.title || pageData.metaTitle || pageData.title || `NobleKey - ${pageSlug}`;
            
            // Get description with priority: seoData.basicSeo.description > metaDescription > description > fallback
            const description = basicSeo?.description || pageData.metaDescription || pageData.description || `Learn more about ${pageSlug}`;
            
            // Get keywords with priority: seoData.basicSeo.keywords > metaKeywords > fallback
            const keywords = basicSeo?.keywords || pageData.metaKeywords || `NobleKey, ${pageSlug}, services, solutions`;
            
            // Get Open Graph data with priority: seoData.ogSeo > basic seo > legacy fields > fallback
            const ogTitle = ogSeo?.title || basicSeo?.title || pageData.metaTitle || pageData.title || `NobleKey - ${pageSlug}`;
            const ogDescription = ogSeo?.description || basicSeo?.description || pageData.metaDescription || pageData.description || `Learn more about ${pageSlug}`;
            const ogImage = ogSeo?.image;
            
            // Validate OpenGraph type - only allow valid types
            const validOgTypes = ['website', 'article', 'book', 'profile', 'music.song', 'music.album', 'music.playlist', 'music.radio_station', 'video.movie', 'video.episode', 'video.tv_show', 'video.other'];
            const ogType = validOgTypes.includes(ogSeo?.type?.toLowerCase() || '') ? ogSeo?.type?.toLowerCase() : 'website';
            const siteName = ogSeo?.siteName || 'NobleKey';

            const metadata: Metadata = {
                title,
                description,
                keywords,
                robots: basicSeo?.robots || 'index, follow',
                openGraph: {
                    title: ogTitle,
                    description: ogDescription,
                    type: ogType as any,
                    url: `/${params.slug.join('/')}`,
                    siteName,
                    ...(ogImage && { images: [{ url: ogImage }] }),
                },
                twitter: {
                    card: 'summary_large_image',
                    title: ogTitle,
                    description: ogDescription,
                    ...(ogImage && { images: [ogImage] }),
                },
            };

            return metadata;
        }
    } catch (error) {
        console.error('Error generating metadata:', error);
    }

    // Fallback metadata
    const pageSlug = params?.slug[params?.slug.length - 1]?.trim() || 'Page';
    return {
        title: `NobleKey - ${pageSlug}`,
        description: `Learn more about ${pageSlug}`,
    };
}

const PagesView = async ({ params }: { params: { slug: string[] } }) => {
    try {
        const pageSlug = params?.slug[params?.slug.length - 1]?.trim();
        const pageData = await getPageDataBySlug(pageSlug) as any;

        if (!pageData?.components || pageData.components.length === 0) {
            return <div>No components to display</div>;
        }

        const renderComponent = (component: PageComponent) => {
            const Component = componentMap[component.customName];

            if (!Component) {
                console.warn(`Component ${component.customName} not found in componentMap`);
                return null;
            }

            return <Component serviceItems={[]} key={component.id} {...component.props} />;
        };

        return (
            <div>
                {pageData.components.map((component: PageComponent) => renderComponent(component))}
            </div>
        );
    } catch (error) {
        console.error('Error rendering page:', error);
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Failed to load page data</p>
                    <p className="text-gray-600">Please try refreshing the page</p>
                </div>
            </div>
        );
    }
};

export default PagesView;
