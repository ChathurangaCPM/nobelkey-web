import { Metadata, Viewport } from 'next';
import MainBanner from "../components/mainBanner";
import WelcomeSection from "../components/home/welcomeSection";
import NumberResults from "../components/home/numberResults";
import FeaturedServices from "../components/home/featuredServices";
import RecentProjects from "../components/home/recentProjects";
import OurBrandRow from "../components/home/ourBrandRow";
import GetQuote from "../components/home/getQuote";
import BlogSection from "../components/home/blogSection";
import { getHomePageData } from "@/lib/dataFetchers";

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

interface PageData {
  _id?: string;
  title?: string;
  metaTitle?: string;
  description?: string;
  metaDescription?: string;
  metaKeywords?: string;
  components?: PageComponent[];
  seoData?: {
    basicSeo?: {
      title?: string;
      description?: string;
      viewport?: string;
      robots?: string;
      keywords?: string;
    };
    ogSeo?: {
      title?: string;
      description?: string;
      image?: string;
      type?: string;
      siteName?: string;
    };
  };
}

interface HomeData {
  themeData?: any;
  pageData?: PageData;
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
} as const;

// Generate viewport for SEO
export async function generateViewport(): Promise<Viewport> {
  try {
    const homeData = await getHomePageData() as any;
    const basicSeo = homeData?.seoData?.basicSeo;
    
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
export async function generateMetadata(): Promise<Metadata> {
  try {
    const homeData = await getHomePageData() as any;
    
    if (homeData) {
      // Prioritize seoData structure over legacy meta fields
      const basicSeo = homeData.seoData?.basicSeo;
      const ogSeo = homeData.seoData?.ogSeo;
      
      // Get title with priority: seoData.basicSeo.title > metaTitle > title > fallback
      const title = basicSeo?.title || homeData.metaTitle || homeData.title || 'NobleKey - Home';
      
      // Get description with priority: seoData.basicSeo.description > metaDescription > description > fallback
      const description = basicSeo?.description || homeData.metaDescription || homeData.description || 'Welcome to NobleKey';
      
      // Get keywords with priority: seoData.basicSeo.keywords > metaKeywords > fallback
      const keywords = basicSeo?.keywords || homeData.metaKeywords || 'NobleKey, services, solutions';
      
      // Get Open Graph data with priority: seoData.ogSeo > basic seo > legacy fields > fallback
      const ogTitle = ogSeo?.title || basicSeo?.title || homeData.metaTitle || homeData.title || 'NobleKey - Home';
      const ogDescription = ogSeo?.description || basicSeo?.description || homeData.metaDescription || homeData.description || 'Welcome to NobleKey';
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
          url: '/',
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
  return {
    title: 'NobleKey - Home',
    description: 'Welcome to NobleKey',
  };
}

const Home = async () => {
  try {
    const homeData = await getHomePageData() as any;
    
    // Debug logging
    console.log('Home data received:', JSON.stringify(homeData, null, 2));
    console.log('Components found:', homeData?.components?.length || 0);

    if (!homeData) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">No home page found</p>
            <p className="text-gray-600">Please configure a home page in the admin panel</p>
          </div>
        </div>
      );
    }

    if (!homeData.components || homeData.components.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-yellow-600 mb-4">No components configured</p>
            <p className="text-gray-600">Please add components to your home page in the admin panel</p>
            <p className="text-sm text-gray-500 mt-2">Page ID: {homeData._id}</p>
          </div>
        </div>
      );
    }

    const renderComponent = (component: PageComponent) => {
      const Component = componentMap[component.customName];

      if (!Component) {
        console.warn(`Component ${component.customName} not found in componentMap`);
        return (
          <div key={component.id} className="p-4 bg-red-100 border border-red-300 rounded">
            <p className="text-red-600">Component "{component.customName}" not found</p>
          </div>
        );
      }

      return <Component serviceItems={[]} key={component.id} {...component.props} />;
    };

    return (
      <div>
        {homeData.components.map((component: PageComponent) => renderComponent(component))}
      </div>
    );
  } catch (error) {
    console.error('Error rendering home page:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load page data</p>
          <p className="text-gray-600">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
};

export default Home;
